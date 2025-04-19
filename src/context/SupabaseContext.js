import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  classifyResponse,
  getResponseTemplate
} from '../utils/enhancedResponseClassifier';
import { getRandomTemplate } from '../data/enhancedMessageTemplates';

// Supabase credentials
const SUPABASE_URL = 'https://ikpqisrldxnpeqdccxpk.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcHFpc3JsZHhucGVxZGNjeHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDMyOTQsImV4cCI6MjA2MDU3OTI5NH0.0TenOVa_HHJpi9gYarnK_Cp6nI0ZrB6UCeI-Gm7W0z4';

// Disable most console logging in production
const log = (process.env.NODE_ENV === 'production') ? 
  () => {} : 
  console.log;

// This console log will help debug API key issues
log('Supabase URL:', SUPABASE_URL);
log('Using Supabase Key:', SUPABASE_ANON_KEY ? 'Key exists' : 'Key missing');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

log('Supabase client initialized with URL:', SUPABASE_URL);

// Twilio API configuration - single source of truth for Twilio settings
const TWILIO_CONFIG = {
  ACCOUNT_SID: 'ACed7175b54c8ce98cbb309c1d4a1ab014',
  AUTH_TOKEN: 'f212bb7fbe9aa7f903fe3d6274cb265c',
  WHATSAPP_NUMBER: 'whatsapp:+14155238886',
  WEBHOOK_URL: 'https://ikpqisrldxnpeqdccxpk.functions.supabase.co/twilio-webhook',
  FOLLOWUP_CHECKER_URL: 'https://ikpqisrldxnpeqdccxpk.functions.supabase.co/followup-checker',
  API_ENDPOINT: function() {
    return `https://api.twilio.com/2010-04-01/Accounts/${this.ACCOUNT_SID}/Messages.json`;
  },
  AUTH_HEADER: function() {
    return 'Basic ' + btoa(`${this.ACCOUNT_SID}:${this.AUTH_TOKEN}`);
  }
};

// Create Context
const SupabaseContext = createContext();

export function useSupabase() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }) {
  const [leadsData, setLeadsData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoFollowupEnabled, setAutoFollowupEnabled] = useState(true); // Auto-followup enabled by default
  
  // Message templates
  const [messageTemplates, setMessageTemplates] = useState({
    initialMessage: "Hi {{name}}, thanks for your interest in international nursing opportunities! Would you like to learn more about opportunities in {{interest}}? Reply to this message to get started.",
    followupMessage: "Hi {{name}}, just following up! Need help exploring international nursing roles?"
  });

  // Load templates from local storage on init
  useEffect(() => {
    const savedTemplates = localStorage.getItem('whatsappTemplates');
    if (savedTemplates) {
      try {
        setMessageTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Error parsing saved templates', e);
      }
    }
  }, []);

  // Save templates to local storage
  const saveMessageTemplates = (templates) => {
    setMessageTemplates(templates);
    localStorage.setItem('whatsappTemplates', JSON.stringify(templates));
    return { success: true };
  };
  
  // Set up real-time subscription for lead updates - using more specific events
  useEffect(() => {
    log('Setting up Supabase real-time subscription...');
    
    // Ensure we have a valid session before attempting to create channels
    const setupRealtime = async () => {
      try {
        // Test authentication before setting up realtime
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          log('Authentication error before setting up realtime:', sessionError);
          return;
        }
        
        // Create a subscription for insert, update, and delete events
        const leadsSubscription = supabase
          .channel('realtime-leads')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'leads'
          }, (payload) => {
            log('Lead UPDATED:', payload);
            fetchLeads();
          })
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'leads'
          }, (payload) => {
            log('Lead INSERTED:', payload);
            fetchLeads();
          })
          .on('postgres_changes', {
            event: 'DELETE',
            schema: 'public',
            table: 'leads'
          }, (payload) => {
            log('Lead DELETED:', payload);
            fetchLeads();
          });
        
        leadsSubscription.subscribe((status) => {
          log('Subscription status:', status);
        });
        
        // Clean up the subscription on unmount
        return () => {
          log('Cleaning up Supabase subscription...');
          leadsSubscription.unsubscribe();
        };
      } catch (error) {
        log('Error setting up realtime subscription:', error);
      }
    };
    
    setupRealtime();
  }, []);
  
  // Set up automatic follow-up checker
  useEffect(() => {
    // Only run if auto-followup is enabled
    if (!autoFollowupEnabled) return;
    
    console.log('Setting up automatic follow-up checkers...');
    
    // Check for first follow-ups every 10 seconds
    // NOTE: FOR PRODUCTION - Change this interval to 60 minutes (3600000 ms) when using 24-hour follow-up timing
    // Current 10-second interval is ONLY for testing purposes with the 20-second threshold
    const firstFollowupInterval = setInterval(() => {
      console.log('Auto-running first follow-up check...');
      checkFollowUps().then(result => {
        if (result && result.count > 0) {
          console.log(`Sent ${result.count} first follow-ups automatically`);
        } else {
          console.log('No leads ready for first follow-up at this time');
        }
      }).catch(err => {
        console.error('Error in automatic first follow-up:', err);
      });
    }, 10000); // 10 seconds - FOR TESTING ONLY
    
    // Check for second follow-ups every 15 seconds
    // NOTE: FOR PRODUCTION - Change this interval to 120 minutes (7200000 ms) when using 48-hour follow-up timing
    // Current 15-second interval is ONLY for testing purposes with the 30-second threshold
    const secondFollowupInterval = setInterval(() => {
      console.log('Auto-running second follow-up check...');
      checkSecondFollowUps().then(result => {
        if (result && result.count > 0) {
          console.log(`Sent ${result.count} second follow-ups automatically`);
        } else {
          console.log('No leads ready for second follow-up at this time');
        }
      }).catch(err => {
        console.error('Error in automatic second follow-up:', err);
      });
    }, 15000); // 15 seconds - FOR TESTING ONLY
    
    // Clean up the intervals on component unmount
    return () => {
      console.log('Cleaning up auto follow-up intervals');
      clearInterval(firstFollowupInterval);
      clearInterval(secondFollowupInterval);
    };
  }, [autoFollowupEnabled]);
  
  // Set up regular data refresh interval
  useEffect(() => {
    console.log('Setting up automatic data refresh interval...');
    
    // Refresh lead data every 30 seconds to check for replies
    const dataRefreshInterval = setInterval(() => {
      console.log('Auto-refreshing lead data...');
      fetchLeads().then(() => {
        console.log('Lead data refreshed automatically');
      }).catch(err => {
        console.error('Error in automatic data refresh:', err);
      });
    }, 30000); // 30 seconds
    
    // Clean up the interval on component unmount
    return () => {
      console.log('Cleaning up auto-refresh interval');
      clearInterval(dataRefreshInterval);
    };
  }, []);
  
  // Fetch leads data
  const fetchLeads = async () => {
    log('==== Fetching Leads ====');
    setLoading(true);
    setError(null);
    
    try {
      log('Making Supabase query to leads table...');
      
      // Test the authentication first
      const { data: authTest, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        log('Authentication error:', authError);
        // Try to refresh the session if there's an auth error
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          log('Session refresh failed:', refreshError);
          throw new Error('Authentication failed: ' + refreshError.message);
        } else {
          log('Session refreshed successfully');
        }
      }
      
      // Now fetch the leads data
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      log('Supabase query complete');
      
      if (error) {
        log('Supabase fetch error:', error);
        throw error;
      }
      
      // Success - update state
      setLeadsData(data || []);
      
      // Calculate statistics
      const statsData = {
        total: data?.length || 0,
        sent: data?.filter(lead => lead.status === 'sent').length || 0,
        delivered: data?.filter(lead => lead.status === 'delivered').length || 0,
        read: data?.filter(lead => lead.status === 'read').length || 0,
        replied: data?.filter(lead => lead.replied).length || 0,
        failed: data?.filter(lead => lead.status === 'failed').length || 0,
      };
      
      setStats(statsData);
      
      return { success: true, data };
    } catch (err) {
      log('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch leads');
      return { success: false, error: err };
    } finally {
      setLoading(false);
      log('==== Fetch Leads Complete ====');
    }
  };

  // Add leads from CSV data
  const addLeadsFromCSV = async (leadsData) => {
    if (!leadsData || !Array.isArray(leadsData) || leadsData.length === 0) {
      console.error('Invalid leads data provided');
      return { success: false, error: 'Invalid leads data provided' };
    }
    
    console.log('Adding leads from CSV:', leadsData);
    
    try {
      // Format the leads data for insertion
      const formattedLeads = leadsData.map(lead => {
        // Ensure phone number is in E.164 format (proper international format)
        // It should already include country code from the CSV processing
        const phoneWithPlus = lead.phone.startsWith('+') ? lead.phone : `+${lead.phone}`;
        
        return {
          name: lead.name || '',
          phone: phoneWithPlus,
          interest: lead.interest || '',
          email: lead.email || '',
          status: 'not_sent',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
      
      // Insert the leads into the database
      const { data, error } = await supabase
        .from('leads')
        .insert(formattedLeads)
        .select();
      
      if (error) {
        console.error('Error inserting leads:', error);
        throw error;
      }
      
      console.log('Successfully added leads:', data);
      
      // Refresh the leads data
      await fetchLeads();
      
      return { success: true, count: data?.length || 0, data };
    } catch (error) {
      console.error('Error in addLeadsFromCSV:', error);
      return { success: false, error: error.message };
    }
  };

  // Send WhatsApp messages to leads
  const sendWhatsAppCampaign = async (customMessage = "", leadIds = [], templateType = "") => {
    try {
      setLoading(true);
      
      // If no specific leadIds provided, get all unsent leads
      let leadsToMessage = [];
      
      if (leadIds.length > 0) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .in('id', leadIds);
        
        if (error) throw error;
        leadsToMessage = data;
      } else {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('status', 'not_sent');
        
        if (error) throw error;
        leadsToMessage = data;
      }
      
      if (!leadsToMessage || leadsToMessage.length === 0) {
        return { success: true, count: 0, message: 'No leads to message' };
      }
      
      // Process each lead one by one using Twilio API
      let successCount = 0;
      let skippedLeads = 0;
      
      for (const lead of leadsToMessage) {
        try {
          // Check if lead is in a valid state for the requested follow-up
          if (templateType === 'firstFollowUp' && !['sent', 'delivered', 'read'].includes(lead.status)) {
            console.log(`Skipping lead ${lead.name} (${lead.id}) for first follow-up: invalid status ${lead.status}`);
            skippedLeads++;
            continue; // Skip this lead
          }
          
          if (templateType === 'secondFollowUp' && lead.status !== 'follow_up_sent') {
            console.log(`Skipping lead ${lead.name} (${lead.id}) for second follow-up: invalid status ${lead.status}`);
            skippedLeads++;
            continue; // Skip this lead
          }
          
          // Check if this lead just received a message in the last few seconds
          const lastUpdateTime = new Date(lead.updated_at).getTime();
          const now = new Date().getTime();
          const millisecondsSinceUpdate = now - lastUpdateTime;
          
          // If it's been less than 5 seconds since the last update, skip to prevent back-to-back follow-ups
          if (millisecondsSinceUpdate < 5000 && (templateType === 'firstFollowUp' || templateType === 'secondFollowUp')) {
            console.log(`Skipping lead ${lead.name} (${lead.id}) for follow-up: too soon after last update (${millisecondsSinceUpdate}ms)`);
            skippedLeads++;
            continue; // Skip this lead
          }

          // Use randomized templates for a more personalized approach
          // Select a random initial message template
          let personalizedMessage = customMessage;
          let selectedTemplateId = '';
          let statusToSet = 'processing';
          
          // If no custom message provided, use the template system
          if (!personalizedMessage) {
            // Determine which template type to use based on the lead's current status
            let effectiveTemplateType = templateType;
            
            if (!effectiveTemplateType) {
              // Auto-detect the template type based on lead status if not specified
              if (['sent', 'delivered', 'read'].includes(lead.status) && !lead.replied) {
                effectiveTemplateType = 'firstFollowUp';
                statusToSet = 'follow_up_processing';
              } else if (lead.status === 'follow_up_sent' && !lead.replied) {
                effectiveTemplateType = 'secondFollowUp';
                statusToSet = 'second_follow_up_processing';
              } else {
                effectiveTemplateType = 'initial';
              }
            } else if (effectiveTemplateType === 'firstFollowUp') {
              // Explicitly set the status based on the template type
              statusToSet = 'follow_up_processing';
            } else if (effectiveTemplateType === 'secondFollowUp') {
              statusToSet = 'second_follow_up_processing';
            }
            
            console.log(`Using template type: ${effectiveTemplateType} for lead ${lead.name} (${lead.id})`);
            
            const template = getRandomTemplate(effectiveTemplateType);
            selectedTemplateId = template.id;
            
            personalizedMessage = template.text
              .replace(/{{name}}/g, lead.name)
              .replace(/{{interest}}/g, lead.interest || 'healthcare abroad');
              
            // Ensure the message has the sandbox prefix for Twilio
            const sandboxPrefix = template.sandboxPrefix || "Hello! This is BorderPlus.";
            if (!personalizedMessage.startsWith(sandboxPrefix)) {
              personalizedMessage = `${sandboxPrefix} ${personalizedMessage}`;
            }
          }
          
          // First, mark the lead as being processed
          await supabase
            .from('leads')
            .update({
              status: statusToSet,
              updated_at: new Date().toISOString(),
              template_used: selectedTemplateId
            })
            .eq('id', lead.id);
          
          // Format the phone number correctly for Twilio
          let formattedPhone = lead.phone;
          console.log('Original phone number:', formattedPhone);
          
          // Handle scientific notation if needed
          if (formattedPhone.includes('e') || formattedPhone.includes('E')) {
            try {
              const fullNum = Number(formattedPhone).toFixed(0);
              formattedPhone = String(fullNum);
              console.log('Converted phone from scientific notation:', formattedPhone);
            } catch (e) {
              console.error('Failed to convert phone from scientific notation:', e);
            }
          }
          
          // Ensure it has a plus sign for international format
          if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
          }
          console.log('Formatted phone number:', formattedPhone);
          
          console.log(`Sending WhatsApp message to ${formattedPhone}`);
          
          // Now actually make the call to Twilio API
          const twilioEndpoint = TWILIO_CONFIG.API_ENDPOINT();
          const twilioAuthHeader = TWILIO_CONFIG.AUTH_HEADER();
          
          const formData = new URLSearchParams();
          formData.append('From', TWILIO_CONFIG.WHATSAPP_NUMBER);
          formData.append('To', `whatsapp:${formattedPhone}`);
          formData.append('Body', personalizedMessage);
          // Use the status callbacks defined in constants
          formData.append('StatusCallback', TWILIO_CONFIG.WEBHOOK_URL);
          
          const response = await fetch(twilioEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': twilioAuthHeader,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          });
          
          console.log('Twilio API response status:', response.status);
          
          if (response.ok) {
            const responseData = await response.json();
            console.log('Message sent, SID:', responseData.sid);
            console.log('Full Twilio response:', responseData);
            
            // Determine the correct status to set based on template type
            let successStatus = 'sent';
            if (statusToSet === 'follow_up_processing') {
              successStatus = 'follow_up_sent';
            } else if (statusToSet === 'second_follow_up_processing') {
              successStatus = 'second_follow_up_sent';
            }
            
            console.log(`Setting status to ${successStatus} for lead ${lead.id}`);
            
            // After sending the message successfully, update the lead status directly via fetch
            try {
              // Direct fetch for status update
              const updateResult = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
                method: 'PATCH',
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                  status: successStatus,
                  last_sent_at: new Date().toISOString(),
                  twilio_message_sid: responseData.sid
                })
              });
              
              if (updateResult.ok) {
                console.log('Successfully updated lead status to sent');
              } else {
                console.error('Error updating lead status:', await updateResult.text());
              }
              
              successCount++;
            } catch (updateError) {
              console.error('Exception during lead status update:', updateError);
              // Still count as success since the message was sent
              successCount++;
            }
          } else {
            const errorText = await response.text();
            console.error('Twilio API error:', errorText);
            
            // Update with failure status
            try {
              // Direct fetch for failed status
              const updateResult = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
                method: 'PATCH',
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                  status: 'failed'
                })
              });
              
              if (updateResult.ok) {
                console.log('Updated lead status to failed');
              } else {
                console.error('Error updating lead failed status:', await updateResult.text());
              }
            } catch (updateError) {
              console.error('Exception during lead failure status update:', updateError);
            }
          }
        } catch (leadError) {
          console.error('Error processing lead:', leadError);
          // If sending to this lead fails, update its status but continue with others
          try {
            // Direct fetch for error status
            const updateResult = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                status: 'error'
              })
            });
            
            if (updateResult.ok) {
              console.log('Updated lead status to error');
            } else {
              console.error('Error updating lead error status:', await updateResult.text());
            }
          } catch (updateError) {
            console.error('Exception during lead error status update:', updateError);
          }
        }
      }
      
      // Refresh leads after sending messages
      await fetchLeads();
      
      return { 
        success: true, 
        count: successCount,
        skipped: skippedLeads,
        message: `WhatsApp messages sent to ${successCount} leads, ${skippedLeads} skipped`
      };
    } catch (error) {
      console.error('Campaign error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check for leads needing follow-up
  const checkFollowUps = async (ignoreTimeConstraint = false) => {
    try {
      setLoading(true);
      console.log('Starting follow-up check...');
      
      // Base query for leads that need follow-up
      let query = supabase
        .from('leads')
        .select('*')
        .in('status', ['sent', 'delivered', 'read'])
        .eq('replied', false);
      
      // Only apply time constraint if not ignored (for manual follow-ups)
      if (!ignoreTimeConstraint) {
        // For testing purposes: use 20 seconds instead of 24 hours
        const timeThreshold = new Date();
        timeThreshold.setSeconds(timeThreshold.getSeconds() - 20); // 20 seconds ago
        console.log('Looking for leads last contacted before:', timeThreshold.toISOString());
        query = query.lt('last_sent_at', timeThreshold.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log('No leads found needing follow-up');
        return { success: true, count: 0, message: 'No leads need follow-up' };
      }
      
      console.log(`Found ${data.length} leads needing follow-up:`, data.map(l => l.name).join(', '));
      
      // Get the lead IDs for all leads that need follow-up
      const leadIds = data.map(lead => lead.id);
      
      // Use the existing sendWhatsAppCampaign function with the firstFollowUp template type
      const result = await sendWhatsAppCampaign('', leadIds, 'firstFollowUp');
      
      return result;
    } catch (error) {
      console.error('Follow-up campaign error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check for leads needing a second follow-up (after 30 seconds)
  const checkSecondFollowUps = async (ignoreTimeConstraint = false) => {
    try {
      setLoading(true);
      console.log('Starting second follow-up check...');
      
      // Base query for leads that need second follow-up - ONLY those with follow_up_sent status
      let query = supabase
        .from('leads')
        .select('*')
        .eq('status', 'follow_up_sent')  // Only looking for leads with follow_up_sent status
        .eq('replied', false);
      
      // Add a minimum time since last follow-up regardless of ignoreTimeConstraint
      // This ensures a cooling period between follow-ups even for manual sends
      const minCoolingPeriod = new Date();
      minCoolingPeriod.setSeconds(minCoolingPeriod.getSeconds() - 5); // At least 5 seconds between follow-ups
      query = query.lt('last_sent_at', minCoolingPeriod.toISOString());
      
      // Apply the full time constraint if not doing a manual send
      if (!ignoreTimeConstraint) {
        // Using 30 seconds for testing
        const timeThreshold = new Date();
        timeThreshold.setSeconds(timeThreshold.getSeconds() - 30); // 30 seconds ago
        console.log('Looking for leads with follow-up sent before:', timeThreshold.toISOString());
        query = query.lt('last_sent_at', timeThreshold.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log('No leads found needing second follow-up');
        return { success: true, count: 0, message: 'No leads need second follow-up' };
      }
      
      // Add a check for leads that haven't just received a first follow-up
      // Filter out any leads whose status was updated in the last few seconds
      const filteredLeads = data.filter(lead => {
        const lastUpdateTime = new Date(lead.updated_at).getTime();
        const now = new Date().getTime();
        const millisecondsSinceUpdate = now - lastUpdateTime;
        
        // Ensure at least 5 seconds have passed since the last status update
        return millisecondsSinceUpdate > 5000;
      });
      
      if (filteredLeads.length === 0) {
        console.log('All potential leads for second follow-up have just been updated');
        return { success: true, count: 0, message: 'No leads ready for second follow-up' };
      }
      
      console.log(`Found ${filteredLeads.length} leads needing second follow-up:`, filteredLeads.map(l => l.name).join(', '));
      
      // Get the lead IDs for all leads that need second follow-up
      const leadIds = filteredLeads.map(lead => lead.id);
      
      // Use the existing sendWhatsAppCampaign function with the secondFollowUp template type
      const result = await sendWhatsAppCampaign('', leadIds, 'secondFollowUp');
      
      return result;
    } catch (error) {
      console.error('Second follow-up campaign error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a lead
  const deleteLead = async (leadId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);
      
      if (error) throw error;
      
      // Refresh leads after deleting
      await fetchLeads();
      
      return { success: true };
    } catch (error) {
      log('Error deleting lead:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Generate CSV template
  const getCSVTemplate = () => {
    const templateData = [
      {
        name: 'John Doe',
        phone: '+1234567890',
        interest: 'Nursing in Canada',
        email: 'johndoe@example.com'
      }
    ];
    
    return templateData;
  };

  // Handle incoming WhatsApp responses from leads
  const processLeadResponse = async (lead, responseText) => {
    try {
      console.log(`Processing response from ${lead.name}: "${responseText}"`);
      
      // Classify the response to determine the appropriate reply
      const responseCategory = classifyResponse(responseText);
      console.log(`Response classified as: ${responseCategory}`);
      
      // Get appropriate response template based on the classification
      const replyTemplate = getResponseTemplate(responseCategory);
      
      // Personalize the response
      const personalizedReply = replyTemplate.text
        .replace(/{{name}}/g, lead.name)
        .replace(/{{interest}}/g, lead.interest || 'healthcare abroad');
      
      // Ensure the message has the sandbox prefix for Twilio
      const sandboxPrefix = replyTemplate.sandboxPrefix || "Hello! This is BorderPlus.";
      const formattedReply = personalizedReply.startsWith(sandboxPrefix) ? 
        personalizedReply : `${sandboxPrefix} ${personalizedReply}`;
      
      // Format the phone number correctly for Twilio
      let formattedPhone = lead.phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }
      
      console.log(`Sending auto-reply to ${formattedPhone}`);
      
      // Make the direct call to Twilio API for the auto-reply
      const twilioEndpoint = TWILIO_CONFIG.API_ENDPOINT();
      const twilioAuthHeader = TWILIO_CONFIG.AUTH_HEADER();
      
      const formData = new URLSearchParams();
      formData.append('From', TWILIO_CONFIG.WHATSAPP_NUMBER);
      formData.append('To', `whatsapp:${formattedPhone}`);
      formData.append('Body', formattedReply);
      formData.append('StatusCallback', TWILIO_CONFIG.WEBHOOK_URL);
      
      const response = await fetch(twilioEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': twilioAuthHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Auto-reply sent, SID:', responseData.sid);
        
        // Update the database with the reply
        try {
          const { data: updateData, error: updateError } = await supabase
            .from('leads')
            .update({
              status: 'replied_to',
              last_sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              twilio_message_sid: responseData.sid
            })
            .eq('id', lead.id);
          
          if (updateError) {
            console.error('Error updating lead status after sending auto-reply:', updateError);
          } else {
            console.log('Successfully updated lead status to replied_to');
          }
        } catch (updateError) {
          console.error('Exception during lead status update:', updateError);
        }
        
        return { success: true, message: 'Auto-reply sent successfully' };
      } else {
        const errorText = await response.text();
        console.error('Twilio API error on auto-reply:', errorText);
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error('Error processing lead response:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle webhook events from Twilio for incoming messages
  const handleTwilioWebhook = async (webhookData) => {
    try {
      const { From, Body, SmsStatus, MessageSid } = webhookData;
      
      // Extract the phone number from the WhatsApp format
      const phoneNumber = From.replace('whatsapp:', '');
      
      // Find the lead with this phone number
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', phoneNumber)
        .maybeSingle();
      
      if (leadError) throw leadError;
      
      if (!leadData) {
        console.error(`No lead found with phone number ${phoneNumber}`);
        return { success: false, error: 'Lead not found' };
      }
      
      if (Body) {
        // This is a message from the lead
        console.log(`Received message from ${leadData.name}: "${Body}"`);
        
        // Update the lead record to mark as replied
        try {
          const { data: updateData, error: updateError } = await supabase
            .from('leads')
            .update({
              status: 'replied',
              replied: true,
              last_reply_at: new Date().toISOString(),
              last_reply_text: Body,
              updated_at: new Date().toISOString()
            })
            .eq('id', leadData.id);
          
          if (updateError) {
            console.error('Error updating lead status to replied:', updateError);
          }
        } catch (updateError) {
          console.error('Exception during lead status update:', updateError);
        }
        
        // Process the response and send an auto-reply if needed
        return await processLeadResponse(leadData, Body);
      } else if (SmsStatus) {
        // This is a status update for a message we sent
        console.log(`Message status update for ${leadData.name}: ${SmsStatus}`);
        
        // Update the message status in the database
        try {
          const { data: updateData, error: updateError } = await supabase
            .from('leads')
            .update({
              status: SmsStatus.toLowerCase(),
              updated_at: new Date().toISOString()
            })
            .eq('twilio_message_sid', MessageSid);
          
          if (updateError) {
            console.error('Error updating lead status:', updateError);
          }
        } catch (updateError) {
          console.error('Exception during lead status update:', updateError);
        }
        
        return { success: true, message: 'Status updated' };
      }
      
      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      console.error('Error handling Twilio webhook:', error);
      return { success: false, error: error.message };
    }
  };

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const value = {
    supabase,
    leadsData,
    stats,
    loading,
    error,
    fetchLeads,
    addLeadsFromCSV,
    sendWhatsAppCampaign,
    checkFollowUps,
    checkSecondFollowUps,
    deleteLead,
    getCSVTemplate,
    messageTemplates,
    saveMessageTemplates,
    autoFollowupEnabled,
    toggleAutoFollowup: () => setAutoFollowupEnabled(prev => !prev),
    processLeadResponse,
    handleTwilioWebhook
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

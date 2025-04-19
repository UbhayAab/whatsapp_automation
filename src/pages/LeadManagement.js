import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Snackbar, 
  Alert,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  WhatsApp as WhatsAppIcon,
  ContactPhone as ContactPhoneIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSupabase } from '../context/SupabaseContext';
import LeadsDataTable from '../components/leads/LeadsDataTable';
import { generateCSVTemplate, convertCSVToLeads } from '../components/CSVTemplateHelper';
import ResponseClassifier from '../components/ResponseClassifier';
import LeadImport from '../components/LeadImport';
import Papa from 'papaparse';

// Create a component for CSV helper
const CSVTemplateHelperComponent = () => {
  const downloadTemplate = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'lead_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        CSV Upload Instructions
      </Typography>
      <Typography variant="body1" paragraph>
        The CSV file should include the following columns:
      </Typography>
      <ul>
        <li><Typography variant="body2">name - Full name of the lead (required)</Typography></li>
        <li><Typography variant="body2">country_code - Country code (e.g., 91 for India, 1 for US) (required)</Typography></li>
        <li><Typography variant="body2">phone_number - Phone number without country code (required)</Typography></li>
      </ul>
      <Typography variant="body1" paragraph>
        Notes:
      </Typography>
      <ul>
        <li><Typography variant="body2">Phone numbers should include the country code (e.g., +491234567890)</Typography></li>
        <li><Typography variant="body2">If country code is missing, it will be assumed to be a German number</Typography></li>
        <li><Typography variant="body2">Each lead must have at least a name and phone number</Typography></li>
      </ul>
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={downloadTemplate}
          startIcon={<CloudUploadIcon />}
        >
          Download Template
        </Button>
      </Box>
    </Box>
  );
};

const LeadManagement = () => {
  const theme = useTheme();
  const { 
    leadsData, 
    fetchLeads, 
    sendWhatsAppCampaign, 
    deleteLead,
    addLeadsFromCSV 
  } = useSupabase();
  
  // Other state for the component
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showCSVHelper, setShowCSVHelper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    email: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setIsUploading(true);
      
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log('CSV Parse Results:', results);
          
          const { data, success, error } = convertCSVToLeads(results.data);
          
          if (success) {
            // Upload leads to database
            addLeadsFromCSV(data)
              .then((result) => {
                // Reset the file input
                event.target.value = '';
                fetchLeads(); // Refresh the leads list
                setSnackbar({
                  open: true,
                  message: `Successfully imported ${data.length} leads`,
                  severity: 'success'
                });
              })
              .catch((error) => {
                console.error('Error adding leads:', error);
                setSnackbar({
                  open: true,
                  message: `Error adding leads: ${error.message}`,
                  severity: 'error'
                });
              })
              .finally(() => {
                setIsUploading(false);
              });
          } else {
            setIsUploading(false);
            // Reset the file input
            event.target.value = '';
            setSnackbar({
              open: true,
              message: `Error processing CSV: ${error || 'Invalid data format'}`,
              severity: 'error'
            });
          }
        },
        error: function (error) {
          console.error('Error parsing CSV:', error);
          setIsUploading(false);
          // Reset the file input
          event.target.value = '';
          setSnackbar({
            open: true,
            message: `Error parsing CSV: ${error.message}`,
            severity: 'error'
          });
        }
      });
    }
  };
  
  // Handle sending a message to a specific lead
  const handleSendMessage = async (lead) => {
    try {
      const result = await sendWhatsAppCampaign('', [lead.id]);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Message sent to ${lead.name}`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Error: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error sending message: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle sending a manual follow-up to a lead
  const handleManualFollowUp = async (lead) => {
    if (!lead || !lead.id) return;
    
    try {
      // Send a manual follow-up message
      const result = await sendWhatsAppCampaign('', [lead.id], 'firstFollowUp');
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Follow-up message sent successfully!',
          severity: 'success'
        });
        fetchLeads(); // Refresh lead data
      } else {
        setSnackbar({
          open: true,
          message: `Error sending follow-up: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error sending manual follow-up:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Handle sending a manual second follow-up to a lead
  const handleManualSecondFollowUp = async (lead) => {
    if (!lead || !lead.id) return;
    
    try {
      // Send a manual second follow-up message
      const result = await sendWhatsAppCampaign('', [lead.id], 'secondFollowUp');
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Second follow-up message sent successfully!',
          severity: 'success'
        });
        fetchLeads(); // Refresh lead data
      } else {
        setSnackbar({
          open: true,
          message: `Error sending second follow-up: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error sending manual second follow-up:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle editing a lead
  const handleEditLead = (lead) => {
    setCurrentLead(lead);
    setEditFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      interest: lead.interest || ''
    });
    setEditDialogOpen(true);
  };
  
  // Handle saving edited lead
  const handleSaveEdit = async () => {
    try {
      const updatedLead = {
        ...currentLead,
        ...editFormData
      };
      
      // await updateLead(updatedLead);
      
      setSnackbar({
        open: true,
        message: `Lead "${editFormData.name}" updated successfully`,
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating lead: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle delete lead
  const handleDeleteLead = (lead) => {
    if (!lead) return;
    
    setCurrentLead(lead);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirming lead deletion
  const handleConfirmDelete = async () => {
    if (!currentLead) return;
    
    try {
      const result = await deleteLead(currentLead.id);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: `Successfully deleted ${currentLead.name}`,
          severity: 'success'
        });
        setDeleteDialogOpen(false);
        fetchLeads(); // Refresh lead data
      } else {
        setSnackbar({
          open: true,
          message: `Error: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      setSnackbar({
        open: true,
        message: `Error deleting lead: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Refresh data
  const handleRefresh = () => {
    fetchLeads();
    setSnackbar({
      open: true,
      message: 'Lead data refreshed',
      severity: 'info'
    });
  };
  
  // Handle form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Lead Management
        </Typography>
      </Box>
      
      {/* Lead Import Section */}
      <LeadImport onImportComplete={(importedLeads) => {
        // Refresh leads data after import
        fetchLeads();
        setSnackbar({
          open: true,
          message: `Successfully imported ${importedLeads.length} new leads`,
          severity: 'success'
        });
      }} />
      
      {/* Bulk Message Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          color="primary"
          onClick={() => sendWhatsAppCampaign()}
          disabled={isUploading}
          size="large"
        >
          Send Messages to All New Leads
        </Button>
      </Box>
      
      {/* Leads Data Table Section */}
      <Paper sx={{ mb: 3, p: 2, boxShadow: theme.shadows[4] }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Leads Database
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
        <LeadsDataTable 
          leads={leadsData}
          loading={isUploading}
          onSendMessage={handleSendMessage}
          onManualFollowUp={handleManualFollowUp}
          onManualSecondFollowUp={handleManualSecondFollowUp}
          onRefresh={handleRefresh}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
        />
        
        {/* Delivery Logs Download Button */}
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (!leadsData || leadsData.length === 0) return;
              const headers = ['Name', 'Phone_Number', 'Delivery_Status', 'Last_Contacted', 'Email', 'Interest_Area'];
              
              // Format rows with special handling for phone numbers to prevent scientific notation
              const rows = leadsData.map(lead => {
                // Format phone number with a leading apostrophe to force text format
                const phoneFormatted = `'${lead.phone || lead.phone_number || ''}`;
                
                return [
                  lead.name || '',
                  phoneFormatted, // Forces Excel to treat as text
                  (lead.status === 'delivered' || lead.status === 'read' || lead.status === 'sent') ? 'Success' : (lead.status === 'failed' ? 'Fail' : (lead.status || 'Unknown')),
                  lead.last_contacted || lead.lastContacted || '',
                  lead.email || '',
                  lead.interest || lead.interest_area || ''
                ];
              });
              
              // Create CSV with explicit field separators and wider column width
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
              ].join('\n');
              
              // Create and download file
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.setAttribute('download', 'delivery_logs.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Notification
              setSnackbar({
                open: true,
                message: 'Delivery logs downloaded successfully',
                severity: 'success'
              });
            }}
          >
            Download Delivery Logs
          </Button>
        </Box>
      </Paper>
      
      {/* Response Classifier Section */}
      <ResponseClassifier />
      
      {/* Lead Management Controls */}
      <Paper sx={{ mb: 3, p: 2, boxShadow: theme.shadows[4] }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => setShowCSVHelper(true)}
            >
              Help
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* CSV Helper Dialog */}
      <Dialog
        open={showCSVHelper}
        onClose={() => setShowCSVHelper(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>CSV Upload Guide</DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              1. Download our CSV template
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const csv = generateCSVTemplate();
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', 'lead_template.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              sx={{ mr: 2, mb: 2 }}
            >
              Download Template
            </Button>
            
            <Typography variant="subtitle1" gutterBottom>
              2. Fill in your leads data with these required columns:
            </Typography>
            <Box component="ul" sx={{ ml: 2, mb: 2 }}>
              <Typography component="li" variant="body2">
                <strong>name</strong> - Full name of the lead
              </Typography>
              <Typography component="li" variant="body2">
                <strong>country_code</strong> - Country code (e.g., 91 for India, 1 for US)
              </Typography>
              <Typography component="li" variant="body2">
                <strong>phone_number</strong> - Phone number without country code
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCSVHelper(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Lead Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editFormData.name}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            value={editFormData.phone}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Interest Area"
            name="interest"
            value={editFormData.interest}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Lead Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {currentLead?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LeadManagement;

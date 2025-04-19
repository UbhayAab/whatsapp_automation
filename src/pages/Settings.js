import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Divider, 
  Paper, 
  Switch,
  FormControlLabel,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tooltip,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  ExpandMore as ExpandMoreIcon,
  WhatsApp as WhatsAppIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  Security as SecurityIcon,
  SettingsApplications as SettingsApplicationsIcon,
  Message as MessageIcon,
  MessageOutlined as MessageOutlinedIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  FormatListBulleted as FormatListBulletedIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ScheduleSend as ScheduleSendIcon,
  HourglassEmpty as HourglassEmptyIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useSupabase } from '../context/SupabaseContext';
import { getAllTemplates, getAllTemplatesForCategory } from '../data/enhancedMessageTemplates';
import MessageTemplateManager from '../components/MessageTemplateManager';

const Settings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState('initial');
  const [templates, setTemplates] = useState(getAllTemplates());
  const [editTemplateOpen, setEditTemplateOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [formValues, setFormValues] = useState({
    id: '',
    text: '',
    sandboxPrefix: "Hello! This is BorderPlus."
  });
  
  const { 
    autoFollowupEnabled, 
    toggleAutoFollowup, 
    messageTemplates, 
    saveMessageTemplates 
  } = useSupabase();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Get category display name
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'initial': 'Initial Messages',
      'firstFollowUp': 'First Follow-up Messages',
      'secondFollowUp': 'Second Follow-up Messages',
      'positive': 'Positive Response Replies',
      'negative': 'Negative Response Replies',
      'question': 'General Question Replies',
      'salary_question': 'Salary Question Replies',
      'visa_question': 'Visa Question Replies',
      'language_question': 'Language Question Replies',
      'timeline_question': 'Timeline Question Replies',
      'schedule': 'Schedule Request Replies',
      'later': 'Contact Later Replies',
      'confirmation': 'Confirmation Replies',
      'neutral': 'Neutral Response Replies',
      'unclear': 'Unclear Response Replies'
    };
    
    return categoryMap[category] || category;
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    const categoryMap = {
      'initial': <MessageIcon />,
      'firstFollowUp': <ScheduleSendIcon />,
      'secondFollowUp': <AccessTimeIcon />,
      'positive': <ThumbUpIcon />,
      'negative': <ThumbDownIcon />,
      'question': <QuestionAnswerIcon />,
      'salary_question': <QuestionAnswerIcon />,
      'visa_question': <QuestionAnswerIcon />,
      'language_question': <QuestionAnswerIcon />,
      'timeline_question': <QuestionAnswerIcon />,
      'schedule': <ScheduleSendIcon />,
      'later': <HourglassEmptyIcon />,
      'confirmation': <MessageOutlinedIcon />,
      'neutral': <MessageOutlinedIcon />,
      'unclear': <MessageOutlinedIcon />
    };
    
    return categoryMap[category] || <MessageIcon />;
  };
  
  // Handle accordion change
  const handleAccordionChange = (category) => (event, isExpanded) => {
    setExpandedCategory(isExpanded ? category : false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle opening template edit dialog
  const handleEditTemplate = (template, category) => {
    setCurrentTemplate({ ...template, category });
    setFormValues({
      id: template.id,
      text: template.text,
      sandboxPrefix: template.sandboxPrefix || "Hello! This is BorderPlus."
    });
    setEditTemplateOpen(true);
  };
  
  // Handle creating a new template
  const handleNewTemplate = (category) => {
    const newId = `${category}_${Date.now()}`;
    setCurrentTemplate({ id: newId, category });
    setFormValues({
      id: newId,
      text: '',
      sandboxPrefix: "Hello! This is BorderPlus."
    });
    setEditTemplateOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // Handle saving a template
  const handleSaveTemplate = () => {
    if (!formValues.text) {
      setSnackbar({
        open: true,
        message: 'Template text cannot be empty',
        severity: 'error'
      });
      return;
    }
    
    // Create a copy of templates
    const updatedTemplates = { ...templates };
    
    // If editing an existing template
    if (currentTemplate.id && updatedTemplates[currentTemplate.category]) {
      const templateIndex = updatedTemplates[currentTemplate.category].findIndex(t => t.id === currentTemplate.id);
      
      if (templateIndex !== -1) {
        // Update existing template
        updatedTemplates[currentTemplate.category][templateIndex] = {
          ...updatedTemplates[currentTemplate.category][templateIndex],
          ...formValues
        };
      } else {
        // Add as new template
        updatedTemplates[currentTemplate.category].push({
          ...formValues
        });
      }
    } else if (updatedTemplates[currentTemplate.category]) {
      // Add new template
      updatedTemplates[currentTemplate.category].push({
        ...formValues
      });
    }
    
    // Update state
    setTemplates(updatedTemplates);
    setEditTemplateOpen(false);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Template saved successfully',
      severity: 'success'
    });
  };
  
  // Handle deleting a template
  const handleDeleteTemplate = (templateId, category) => {
    // Create a copy of templates
    const updatedTemplates = { ...templates };
    
    // Filter out the deleted template
    if (updatedTemplates[category]) {
      updatedTemplates[category] = updatedTemplates[category].filter(t => t.id !== templateId);
    }
    
    // Update state
    setTemplates(updatedTemplates);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Template deleted successfully',
      severity: 'success'
    });
  };
  
  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            <SettingsIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
            Settings
          </Typography>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab 
          icon={<MessageIcon />} 
          label="Message Templates" 
          iconPosition="start"
        />
        <Tab 
          icon={<WhatsAppIcon />} 
          label="Twilio Settings" 
          iconPosition="start"
        />
        <Tab 
          icon={<SecurityIcon />} 
          label="API Credentials" 
          iconPosition="start"
        />
        <Tab 
          icon={<SettingsApplicationsIcon />} 
          label="System Settings" 
          iconPosition="start"
        />
      </Tabs>
      
      {/* Message Templates Tab */}
      {activeTab === 0 && (
        <Box>
          <MessageTemplateManager onTemplatesChange={(updatedTemplates) => setTemplates(updatedTemplates)} />
          
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              boxShadow: theme.shadows[4]
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SyncIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Automation Settings
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={autoFollowupEnabled}
                  onChange={toggleAutoFollowup}
                  color="primary"
                />
              }
              label="Enable Automatic Follow-ups"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              When enabled, follow-up messages will be automatically sent to leads who haven't responded after the specified time periods:
            </Typography>
            <List dense sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText 
                  primary="First follow-up: 24 hours after initial message" 
                  secondary="For testing: 20 seconds"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Second follow-up: 48 hours after first follow-up" 
                  secondary="For testing: 30 seconds"
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      )}
      
      {/* Twilio Settings Tab */}
      {activeTab === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, boxShadow: theme.shadows[4] }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WhatsAppIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Twilio WhatsApp Settings
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twilio Account SID"
                  variant="outlined"
                  value="AC0ecfa18bdfd22205799f33830a8cf4b5"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Twilio WhatsApp Number"
                  variant="outlined"
                  value="whatsapp:+14155238886"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twilio Auth Token"
                  variant="outlined"
                  type="password"
                  value="6d6a4a34898b77ead9055e736033d1c1"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Twilio Webhook URL"
                  variant="outlined"
                  value="https://ikpqisrldxnpeqdccxpk.supabase.co/functions/v1/twilio-webhook"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                This application is using the Twilio Sandbox for WhatsApp. Users must join the sandbox to receive messages by sending the displayed code to your Twilio WhatsApp number.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Need to update these settings? Please contact your administrator.
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
      
      {/* API Credentials Tab */}
      {activeTab === 2 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, boxShadow: theme.shadows[4] }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Supabase API Credentials
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supabase URL"
                  variant="outlined"
                  value="https://ikpqisrldxnpeqdccxpk.supabase.co"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supabase Anon Key"
                  variant="outlined"
                  type="password"
                  value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcHFpc3JsZHhucGVxZGNjeHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQyMjkyMjMsImV4cCI6MTk5OTgwNTIyM30.hvGNOLcTFqGJoiPK2YIfnTbP6HbKwkTcf-Id_4hwL3I"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Alert severity="warning">
                Keep these credentials secure and never expose them in client-side code in a production environment.
              </Alert>
            </Box>
          </Paper>
        </Box>
      )}
      
      {/* System Settings Tab */}
      {activeTab === 3 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, boxShadow: theme.shadows[4] }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsApplicationsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                System Configuration
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={true}
                      color="primary"
                    />
                  }
                  label="Real-time Updates"
                />
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
                  Receive instant notifications when leads respond
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={true}
                      color="primary"
                    />
                  }
                  label="Response Classification"
                />
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
                  Automatically categorize incoming responses
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={true}
                      color="primary"
                    />
                  }
                  label="Template Randomization"
                />
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
                  Randomly select message templates for each communication
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={false}
                      color="primary"
                    />
                  }
                  label="Debug Mode"
                />
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3, mb: 2 }}>
                  Show detailed logs and debug information
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Template Edit Dialog */}
      <Dialog
        open={editTemplateOpen}
        onClose={() => setEditTemplateOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentTemplate?.id.includes('_new_') ? 'Create New Template' : 'Edit Template'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="id"
            label="Template ID"
            fullWidth
            variant="outlined"
            value={formValues.id}
            onChange={handleInputChange}
            disabled={!currentTemplate?.id.includes('_new_')}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="sandboxPrefix"
            label="Sandbox Prefix"
            fullWidth
            variant="outlined"
            value={formValues.sandboxPrefix}
            onChange={handleInputChange}
            helperText="This prefix is required for Twilio sandbox testing"
            sx={{ mb: 2 }}
          />
          <TextField
            autoFocus
            margin="dense"
            name="text"
            label="Template Text"
            fullWidth
            variant="outlined"
            multiline
            rows={8}
            value={formValues.text}
            onChange={handleInputChange}
            helperText="Use {{name}} and {{interest}} placeholders for personalization"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTemplateOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Save Template
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  alpha,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Message as MessageIcon,
  ScheduleSend as ScheduleSendIcon,
  AccessTime as AccessTimeIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  QuestionAnswer as QuestionAnswerIcon,
  MessageOutlined as MessageOutlinedIcon,
  HourglassEmpty as HourglassEmptyIcon,
  FormatListBulleted as FormatListBulletedIcon
} from '@mui/icons-material';
import { getAllTemplates } from '../data/enhancedMessageTemplates';

/**
 * Premium Message Template Manager Component
 * 
 * This component provides a comprehensive interface for managing message templates
 * across different categories with editing, deletion, and creation capabilities.
 */
const MessageTemplateManager = ({ onTemplatesChange }) => {
  const theme = useTheme();
  const [expandedCategory, setExpandedCategory] = useState('initial');
  const [templates, setTemplates] = useState(getAllTemplates());
  const [editTemplateOpen, setEditTemplateOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [formValues, setFormValues] = useState({
    id: '',
    text: '',
    sandboxPrefix: "Hello! This is BorderPlus."
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Notify parent component about template changes
  useEffect(() => {
    if (onTemplatesChange) {
      onTemplatesChange(templates);
    }
  }, [templates, onTemplatesChange]);
  
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
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          boxShadow: theme.shadows[4]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormatListBulletedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Message Template Management
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Customize message templates for different communication stages. Use <code>{"{{name}}"}</code> and <code>{"{{interest}}"}</code> placeholders for personalization. For Twilio sandbox testing, a prefix is automatically applied.
        </Typography>

        <Box sx={{ mt: 3 }}>
          {Object.keys(templates).map((category) => (
            <Accordion 
              key={category}
              expanded={expandedCategory === category}
              onChange={handleAccordionChange(category)}
              sx={{
                mb: 2,
                boxShadow: theme.shadows[expandedCategory === category ? 4 : 1],
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: theme.spacing(1, 0, 2),
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${category}-content`}
                id={`${category}-header`}
                sx={{
                  backgroundColor: expandedCategory === category ? 
                    alpha(theme.palette.primary.main, 0.08) : 
                    alpha(theme.palette.primary.main, 0.03),
                  '&.Mui-expanded': {
                    minHeight: 56,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(category)}
                  <Typography sx={{ ml: 1, fontWeight: 'medium' }}>
                    {getCategoryDisplay(category)}
                  </Typography>
                  <Chip 
                    label={templates[category].length} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ ml: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <List dense>
                  {templates[category].map((template) => (
                    <ListItem 
                      key={template.id}
                      sx={{ 
                        mb: 1, 
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      <ListItemText
                        primary={template.id}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '80%' }}>
                              {template.text}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit Template">
                          <IconButton 
                            edge="end" 
                            onClick={() => handleEditTemplate(template, category)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Template">
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDeleteTemplate(template.id, category)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleNewTemplate(category)}
                  >
                    Add New Template
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

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
    </Box>
  );
};

export default MessageTemplateManager;

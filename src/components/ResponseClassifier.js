import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  TextField, 
  Button,
  Chip,
  Divider,
  Paper,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  QuestionAnswer as QuestionAnswerIcon,
  AccessTime as AccessTimeIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Help as HelpIcon,
  AttachMoney as AttachMoneyIcon,
  Flight as FlightIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { classifyResponse } from '../utils/responseClassifier';

/**
 * ResponseClassifier component
 * Premium UI component for testing and demonstrating the message classification system
 */
const ResponseClassifier = () => {
  const theme = useTheme();
  const [inputText, setInputText] = useState('');
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentResponses, setRecentResponses] = useState([
    {
      text: "Yes, I am interested in learning more about nursing opportunities in Germany.",
      category: "positive"
    },
    {
      text: "What is the salary range for nurses in Germany?",
      category: "salary_question"
    },
    {
      text: "I don't think this is a good fit for me at the moment.",
      category: "negative"
    },
    {
      text: "How does the visa process work for nurses?",
      category: "visa_question"
    },
    {
      text: "Can we schedule a call to discuss this further?",
      category: "schedule"
    }
  ]);

  // Handle classifying the input text
  const handleClassify = () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    
    // Simulate API call for classification
    setTimeout(() => {
      const result = classifyResponse(inputText);
      setClassification(result);
      
      // Add to recent responses if not already in the list
      if (!recentResponses.some(r => r.text === inputText)) {
        setRecentResponses([
          { text: inputText, category: result.category },
          ...recentResponses.slice(0, 4) // Keep only the 5 most recent
        ]);
      }
      
      setLoading(false);
    }, 800);
  };

  // Get color for category
  const getCategoryColor = (category) => {
    const categoryColors = {
      positive: theme.palette.success.main,
      negative: theme.palette.error.main,
      question: theme.palette.info.main,
      salary_question: theme.palette.warning.main,
      visa_question: theme.palette.info.dark,
      language_question: theme.palette.primary.light,
      timeline_question: theme.palette.secondary.main,
      schedule: theme.palette.success.light,
      later: theme.palette.warning.light,
      confirmation: theme.palette.success.dark,
      neutral: theme.palette.grey[500],
      unclear: theme.palette.grey[400]
    };
    
    return categoryColors[category] || theme.palette.grey[500];
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    const categoryIcons = {
      positive: <ThumbUpIcon />,
      negative: <ThumbDownIcon />,
      question: <QuestionAnswerIcon />,
      salary_question: <AttachMoneyIcon />,
      visa_question: <FlightIcon />,
      language_question: <LanguageIcon />,
      timeline_question: <TimelineIcon />,
      schedule: <ScheduleIcon />,
      later: <HourglassEmptyIcon />,
      confirmation: <CheckCircleIcon />,
      neutral: <MessageIcon />,
      unclear: <HelpIcon />
    };
    
    return categoryIcons[category] || <QuestionAnswerIcon />;
  };

  // Format category name for display
  const formatCategory = (category) => {
    const categoryMap = {
      positive: 'Positive Response',
      negative: 'Negative Response',
      question: 'General Question',
      salary_question: 'Salary Question',
      visa_question: 'Visa Question',
      language_question: 'Language Question',
      timeline_question: 'Timeline Question',
      schedule: 'Schedule Request',
      later: 'Contact Later',
      confirmation: 'Confirmation',
      neutral: 'Neutral Response',
      unclear: 'Unclear Response'
    };
    
    return categoryMap[category] || category;
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            <QuestionAnswerIcon />
          </Avatar>
          <Typography variant="h5" component="h2">
            Response Classifier
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Test our intelligent response classification system. Enter any text to see how our system would classify it for automated response handling.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter a lead response message"
              multiline
              rows={3}
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'I'm interested in learning more about nursing opportunities in Germany'"
            />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleClassify}
                disabled={!inputText.trim() || loading}
              >
                {loading ? 'Classifying...' : 'Classify Response'}
              </Button>
            </Box>
          </Grid>
          
          {classification && (
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 3, 
                  mt: 2, 
                  bgcolor: alpha(getCategoryColor(classification.category), 0.08),
                  borderLeft: `4px solid ${getCategoryColor(classification.category)}`,
                  boxShadow: theme.shadows[2]
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Classification Result:
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(getCategoryColor(classification.category), 0.2),
                      color: getCategoryColor(classification.category),
                      mr: 2
                    }}
                  >
                    {getCategoryIcon(classification.category)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {formatCategory(classification.category)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {classification.confidence}%
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Keywords Detected:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {classification.keywords.map((keyword, index) => (
                    <Chip 
                      key={index}
                      label={keyword}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        bgcolor: alpha(getCategoryColor(classification.category), 0.05),
                        borderColor: getCategoryColor(classification.category),
                        color: getCategoryColor(classification.category)
                      }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Recommended Response Template:
                </Typography>
                <Typography variant="body2">
                  {classification.recommendedTemplate}
                </Typography>
              </Paper>
            </Grid>
          )}
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Classifications
            </Typography>
            <List>
              {recentResponses.map((response, index) => (
                <ListItem 
                  key={index}
                  component="div"
                  onClick={() => {
                    setInputText(response.text);
                    setClassification(null);
                  }}
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: alpha(getCategoryColor(response.category), 0.05),
                    },
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getCategoryColor(response.category), 0.1),
                        color: getCategoryColor(response.category),
                      }}
                    >
                      {getCategoryIcon(response.category)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        sx={{ 
                          display: 'inline',
                          fontWeight: 'medium'
                        }}
                      >
                        {formatCategory(response.category)}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{
                          display: 'inline',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '80%'
                        }}
                      >
                        {response.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResponseClassifier;

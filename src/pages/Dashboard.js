import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Divider,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import { useSupabase } from '../context/SupabaseContext';
import { 
  SendRounded, 
  PeopleRounded, 
  MarkEmailReadRounded, 
  EmailRounded, 
  AccessTimeRounded,
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  CheckCircleOutlineRounded,
  AutorenewRounded,
  QueryStatsRounded
} from '@mui/icons-material';
import EngagementMetrics from '../components/analytics/EngagementMetrics';
import MessageAnalytics from '../components/analytics/MessageAnalytics';
import ResponseAnalytics from '../components/analytics/ResponseAnalytics';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { leadsData, loading, fetchLeads, sendWhatsAppCampaign, checkFollowUps, checkSecondFollowUps, autoFollowupEnabled, toggleAutoFollowup } = useSupabase();
  
  const [stats, setStats] = useState({
    total: 0,
    not_sent: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    failed: 0
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Recent activity list (mockup for now)
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'message_sent',
      lead: 'Maria Rodriguez',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),  // 15 min ago
      details: 'Initial message sent'
    },
    {
      id: 2,
      type: 'message_read',
      lead: 'John Smith',
      timestamp: new Date(Date.now() - 32 * 60000).toISOString(),  // 32 min ago
      details: 'Message read'
    },
    {
      id: 3,
      type: 'reply_received',
      lead: 'Ahmed Hassan',
      timestamp: new Date(Date.now() - 55 * 60000).toISOString(),  // 55 min ago
      details: 'Replied: "Yes, I am interested in learning more"'
    },
    {
      id: 4,
      type: 'follow_up_sent',
      lead: 'Priya Sharma',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),  // 2 hours ago
      details: 'First follow-up sent'
    }
  ]);
  
  // Update stats whenever leads change
  useEffect(() => {
    if (!leadsData) return;
    
    const newStats = {
      total: leadsData.length,
      not_sent: leadsData.filter(lead => lead.status === 'not_sent').length,
      sent: leadsData.filter(lead => ['sent', 'delivered', 'read'].includes(lead.status)).length,
      delivered: leadsData.filter(lead => ['delivered', 'read'].includes(lead.status)).length,
      read: leadsData.filter(lead => lead.status === 'read').length,
      replied: leadsData.filter(lead => lead.replied).length,
      failed: leadsData.filter(lead => lead.status === 'failed').length
    };
    
    setStats(newStats);
  }, [leadsData]);
  
  // Refresh data
  const handleRefresh = async () => {
    await fetchLeads();
    setSnackbar({
      open: true,
      message: 'Dashboard refreshed!',
      severity: 'success'
    });
  };
  
  // Handle sending campaign
  const handleSendCampaign = async () => {
    if (stats.not_sent === 0) {
      setSnackbar({
        open: true,
        message: 'No new leads to message!',
        severity: 'warning'
      });
      return;
    }
    
    try {
      const result = await sendWhatsAppCampaign();
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error: ' + result.error,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error sending messages: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Handle follow-ups
  const handleFollowUps = async () => {
    try {
      const result = await checkFollowUps(true); // Pass true to ignore time constraints for manual follow-ups
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error: ' + result.error,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error processing follow-ups: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Handle second follow-ups
  const handleSecondFollowUps = async () => {
    try {
      const result = await checkSecondFollowUps(true); // Pass true to ignore time constraints for manual follow-ups
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error: ' + result.error,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error processing second follow-ups: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Format timestamp for recent activity
  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 24 * 60) return `${Math.round(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };
  
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'message_sent':
        return <SendRounded color="primary" />;
      case 'message_read':
        return <MarkEmailReadRounded color="info" />;
      case 'reply_received':
        return <WhatsAppIcon color="success" />;
      case 'follow_up_sent':
        return <AutorenewRounded color="warning" />;
      default:
        return <EmailRounded />;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          BorderPlus Lead Dashboard
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Refresh Data'}
        </Button>
      </Box>
      
      {/* Campaign Action Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SendRounded />
                </Avatar>
                <Typography variant="h6" component="div">
                  Initial Campaign
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send initial WhatsApp messages to all new leads that haven't been contacted yet.
              </Typography>
              <Box sx={{ mt: 'auto', mb: 1 }}>
                <Chip 
                  label={`${stats.not_sent} leads ready`} 
                  color={stats.not_sent > 0 ? "primary" : "default"} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<WhatsAppIcon />}
                onClick={handleSendCampaign}
                disabled={loading || stats.not_sent === 0}
              >
                Send Initial Messages
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AutorenewRounded />
                </Avatar>
                <Typography variant="h6" component="div">
                  First Follow-up
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send follow-up messages to leads who haven't responded after the first message. Can be sent at any time.
              </Typography>
              <Box sx={{ mt: 'auto', mb: 1 }}>
                <Chip 
                  label="Normally 24 hours after initial" 
                  color="warning" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label="Available anytime for manual sending" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Button
                variant="contained"
                fullWidth
                color="warning"
                startIcon={<SendRounded />}
                onClick={handleFollowUps}
                disabled={loading}
              >
                Process Follow-ups
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <AccessTimeRounded />
                </Avatar>
                <Typography variant="h6" component="div">
                  Final Follow-up
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send a final follow-up message to leads who haven't responded to previous messages. Can be sent at any time.
              </Typography>
              <Box sx={{ mt: 'auto', mb: 1 }}>
                <Chip 
                  label="Normally 48 hours after first follow-up" 
                  color="error" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label="Available anytime for manual sending" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                startIcon={<SendRounded />}
                onClick={handleSecondFollowUps}
                disabled={loading}
              >
                Process Final Follow-ups
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Engagement Metrics */}
      <Box sx={{ mb: 4 }}>
        <EngagementMetrics stats={stats} />
      </Box>
      
      {/* Message Analytics */}
      <Box sx={{ mb: 4 }}>
        <MessageAnalytics leadData={leadsData} />
      </Box>
      
      {/* Response Analytics */}
      <Box sx={{ mb: 4 }}>
        <ResponseAnalytics leadData={leadsData} />
      </Box>
      
      {/* Recent Activity and Automation Status */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: theme.shadows[4] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              
              <List>
                {recentActivity.map((activity) => (
                  <ListItem
                    key={activity.id}
                    secondaryAction={
                      <Typography variant="body2" color="text.secondary">
                        {formatActivityTime(activity.timestamp)}
                      </Typography>
                    }
                    sx={{ 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.default' }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.lead}
                      secondary={activity.details}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/leads')}
                  endIcon={<QueryStatsRounded />}
                >
                  View All Activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: theme.shadows[4] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Automation Status
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">
                  Auto Follow-ups:
                </Typography>
                <Chip
                  label={autoFollowupEnabled ? "Enabled" : "Disabled"}
                  color={autoFollowupEnabled ? "success" : "default"}
                  onClick={toggleAutoFollowup}
                  clickable
                  icon={autoFollowupEnabled ? <CheckCircleOutlineRounded /> : <AutorenewRounded />}
                />
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                When enabled, follow-ups will be automatically sent according to schedule without manual intervention.
              </Alert>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>System Status:</strong> Operational
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Check:</strong> {new Date().toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Twilio API:</strong> Connected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Database:</strong> Connected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;

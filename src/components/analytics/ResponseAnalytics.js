import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Button,
  ButtonGroup,
  Avatar,
  alpha,
  Chip
} from '@mui/material';
import { 
  QuestionAnswer as QuestionAnswerIcon,
  Message as MessageIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  FilterAlt as FilterAltIcon,
  Schedule as ScheduleIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AccessAlarm as AccessAlarmIcon,
  Language as LanguageIcon,
  AttachMoney as AttachMoneyIcon,
  FlightTakeoff as FlightTakeoffIcon,
  WatchLater as WatchLaterIcon
} from '@mui/icons-material';
import ReactApexChart from 'react-apexcharts';

/**
 * Premium response analytics component for visualizing lead engagement patterns
 */
const ResponseAnalytics = ({ leadData = [] }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState(0);

  // Process data for response type distribution
  const getResponseDistribution = () => {
    // Default data for demonstration - would be replaced with actual data
    const distribution = {
      positive: 18,
      negative: 8,
      question: 23,
      salary_question: 12,
      visa_question: 9,
      language_question: 7,
      timeline_question: 6,
      schedule: 15,
      later: 10,
      confirmation: 14,
      neutral: 5,
      unclear: 3
    };
    
    // If we have actual lead data, process it
    if (leadData.length > 0) {
      const responseCount = {};
      
      leadData.forEach(lead => {
        if (lead.response_category) {
          responseCount[lead.response_category] = (responseCount[lead.response_category] || 0) + 1;
        }
      });
      
      // Only use real data if we have enough responses
      if (Object.keys(responseCount).length > 0) {
        return responseCount;
      }
    }
    
    return distribution;
  };

  // Create data for the response type pie chart
  const createPieChartData = () => {
    const distribution = getResponseDistribution();
    
    // Format data for ApexCharts
    return {
      series: Object.values(distribution),
      labels: Object.keys(distribution).map(key => formatResponseCategory(key))
    };
  };

  // Create data for question type breakdown
  const createQuestionTypeData = () => {
    // Default data for demonstration
    return [
      { question_type: 'General', count: 23 },
      { question_type: 'Salary', count: 12 },
      { question_type: 'Visa', count: 9 },
      { question_type: 'Language', count: 7 },
      { question_type: 'Timeline', count: 6 }
    ];
  };

  // Create data for response timeline
  const createResponseTimeline = () => {
    // Generate dates for the timeline based on selected time range
    const dates = [];
    const now = new Date();
    
    if (timeRange === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      }
    } else if (timeRange === 'month') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - (i * 7));
        dates.push(`Week ${4-i}`);
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }
    
    // Example response data for timeline
    return {
      dates,
      positive: timeRange === 'week' ? [3, 2, 4, 1, 3, 2, 3] : 
               timeRange === 'month' ? [10, 12, 15, 18] : 
               [42, 40, 38, 45, 50, 48, 52, 60, 58, 65, 68, 72],
      negative: timeRange === 'week' ? [1, 2, 0, 1, 1, 2, 1] : 
               timeRange === 'month' ? [4, 5, 5, 6] : 
               [18, 20, 15, 18, 22, 20, 24, 26, 25, 30, 28, 32],
      questions: timeRange === 'week' ? [4, 3, 5, 4, 6, 3, 5] : 
                timeRange === 'month' ? [15, 18, 20, 22] : 
                [60, 65, 62, 70, 72, 75, 78, 80, 85, 88, 90, 95]
    };
  };

  // Create data for response time analysis
  const createResponseTimeData = () => {
    // Default data for demonstration
    return [
      { time_range: 'Within 1 hour', percentage: 15 },
      { time_range: '1-6 hours', percentage: 35 },
      { time_range: '6-12 hours', percentage: 25 },
      { time_range: '12-24 hours', percentage: 15 },
      { time_range: 'Over 24 hours', percentage: 10 }
    ];
  };

  // Format response category names for display
  const formatResponseCategory = (category) => {
    const categoryMap = {
      'positive': 'Positive',
      'negative': 'Negative',
      'question': 'General Question',
      'salary_question': 'Salary Question',
      'visa_question': 'Visa Question',
      'language_question': 'Language Question',
      'timeline_question': 'Timeline Question',
      'schedule': 'Schedule Call',
      'later': 'Contact Later',
      'confirmation': 'Confirmation',
      'neutral': 'Neutral',
      'unclear': 'Unclear'
    };
    
    return categoryMap[category] || category;
  };

  // Get icon for response category
  const getResponseIcon = (category) => {
    const iconMap = {
      'positive': <ThumbUpIcon />,
      'negative': <ThumbDownIcon />,
      'question': <QuestionAnswerIcon />,
      'salary_question': <AttachMoneyIcon />,
      'visa_question': <FlightTakeoffIcon />,
      'language_question': <LanguageIcon />,
      'timeline_question': <AccessAlarmIcon />,
      'schedule': <ScheduleIcon />,
      'later': <WatchLaterIcon />,
      'confirmation': <MessageIcon />,
      'neutral': <MessageIcon />,
      'unclear': <MessageIcon />
    };
    
    return iconMap[category] || <MessageIcon />;
  };

  // Get color for response category
  const getResponseColor = (category) => {
    const colorMap = {
      'positive': theme.palette.success.main,
      'negative': theme.palette.error.main,
      'question': theme.palette.info.main,
      'salary_question': theme.palette.warning.main,
      'visa_question': theme.palette.secondary.main,
      'language_question': theme.palette.info.light,
      'timeline_question': theme.palette.primary.light,
      'schedule': theme.palette.success.light,
      'later': theme.palette.warning.light,
      'confirmation': theme.palette.grey[500],
      'neutral': theme.palette.grey[400],
      'unclear': theme.palette.grey[300]
    };
    
    return colorMap[category] || theme.palette.grey[500];
  };

  // Configure pie chart options for response distribution
  const pieChartOptions = {
    chart: {
      type: 'pie',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: {
        show: false
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: theme.typography.fontFamily,
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: true,
      formatter(val, opts) {
        return `${val.toFixed(0)}%`;
      },
      style: {
        fontSize: '10px',
        fontFamily: theme.typography.fontFamily,
        fontWeight: 'medium'
      },
      textAnchor: 'middle',
      distributed: true,
      offsetX: 0,
      offsetY: 0,
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
          minAngleToShowLabel: 10
        },
        donut: {
          size: '50%'
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function(value) {
          return `${value} responses`;
        }
      }
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.secondary.main,
      theme.palette.info.light,
      theme.palette.primary.light,
      theme.palette.success.light,
      theme.palette.warning.light,
      theme.palette.grey[500],
      theme.palette.grey[400],
      theme.palette.grey[300]
    ],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    }
  };

  // Configure bar chart options for question type breakdown
  const questionTypeOptions = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        },
        distributed: true
      }
    },
    colors: [
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.secondary.main,
      theme.palette.info.light,
      theme.palette.primary.light
    ],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val;
      },
      style: {
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily,
        fontWeight: 'medium',
        colors: [theme.palette.common.white]
      },
      offsetX: 20
    },
    xaxis: {
      categories: createQuestionTypeData().map(item => item.question_type),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function(value) {
          return `${value} questions`;
        }
      }
    }
  };

  // Configure line chart options for response timeline
  const timelineOptions = {
    chart: {
      type: 'line',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    stroke: {
      width: [3, 3, 3],
      curve: 'smooth'
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.info.main
    ],
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: createResponseTimeline().dates,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Responses',
        style: {
          fontSize: '14px',
          fontFamily: theme.typography.fontFamily,
          fontWeight: 'medium'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      markers: {
        width: 10,
        height: 10,
        radius: 5
      },
      itemMargin: {
        horizontal: 10
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function(value) {
          return `${value} responses`;
        }
      }
    }
  };

  // Configure bar chart options for response time analysis
  const responseTimeOptions = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: [
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.warning.light,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + '%';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily,
        fontWeight: 'medium',
        colors: [theme.palette.text.secondary]
      }
    },
    xaxis: {
      categories: createResponseTimeData().map(item => item.time_range),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      title: {
        text: 'Percentage',
        style: {
          fontSize: '14px',
          fontFamily: theme.typography.fontFamily,
          fontWeight: 'medium'
        }
      },
      labels: {
        formatter: function(val) {
          return val + '%';
        },
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function(value) {
          return `${value}%`;
        }
      }
    }
  };

  // Calculate statistics for summary
  const calculateStats = () => {
    // Default stats for demonstration
    return {
      totalResponses: 130,
      positiveRate: 45,
      questionRate: 35,
      callRequests: 15,
      mostCommonQuestion: 'Salary questions'
    };
  };

  const stats = calculateStats();
  const pieChartData = createPieChartData();
  const questionTypeData = createQuestionTypeData();
  const responseTimelineData = createResponseTimeline();
  const responseTimeData = createResponseTimeData();

  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: theme.shadows[8],
      overflow: 'visible',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        boxShadow: theme.shadows[12],
        transform: 'translateY(-5px)'
      }
    }}>
      <CardContent>
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
              <QuestionAnswerIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
              Response Analytics
            </Typography>
          </Box>
          
          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setTimeRange('week')}
              variant={timeRange === 'week' ? 'contained' : 'outlined'}
            >
              Week
            </Button>
            <Button 
              onClick={() => setTimeRange('month')}
              variant={timeRange === 'month' ? 'contained' : 'outlined'}
            >
              Month
            </Button>
            <Button 
              onClick={() => setTimeRange('year')}
              variant={timeRange === 'year' ? 'contained' : 'outlined'}
            >
              Year
            </Button>
          </ButtonGroup>
        </Box>

        {/* Response overview cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h6" gutterBottom>Total Responses</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalResponses}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                backgroundColor: alpha(theme.palette.success.main, 0.05),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h6" gutterBottom>Positive Rate</Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {stats.positiveRate}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                backgroundColor: alpha(theme.palette.info.main, 0.05),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h6" gutterBottom>Question Rate</Typography>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {stats.questionRate}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                backgroundColor: alpha(theme.palette.warning.main, 0.05),
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h6" gutterBottom>Call Requests</Typography>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {stats.callRequests}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab icon={<PieChartIcon />} label="Response Types" />
          <Tab icon={<TimelineIcon />} label="Response Timeline" />
          <Tab icon={<QuestionAnswerIcon />} label="Question Analysis" />
          <Tab icon={<AccessAlarmIcon />} label="Response Time" />
        </Tabs>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            backgroundColor: theme.palette.background.default,
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {activeTab === 0 && (
            <ReactApexChart
              options={pieChartOptions}
              series={pieChartData.series}
              type="pie"
              height={380}
              width="100%"
            />
          )}
          
          {activeTab === 1 && (
            <ReactApexChart
              options={timelineOptions}
              series={[
                {
                  name: 'Positive',
                  data: responseTimelineData.positive
                },
                {
                  name: 'Negative',
                  data: responseTimelineData.negative
                },
                {
                  name: 'Questions',
                  data: responseTimelineData.questions
                }
              ]}
              type="line"
              height={380}
              width="100%"
            />
          )}
          
          {activeTab === 2 && (
            <ReactApexChart
              options={questionTypeOptions}
              series={[
                {
                  name: 'Questions',
                  data: questionTypeData.map(item => item.count)
                }
              ]}
              type="bar"
              height={380}
              width="100%"
            />
          )}
          
          {activeTab === 3 && (
            <ReactApexChart
              options={responseTimeOptions}
              series={[
                {
                  name: 'Percentage',
                  data: responseTimeData.map(item => item.percentage)
                }
              ]}
              type="bar"
              height={380}
              width="100%"
            />
          )}
        </Paper>

        {/* Key insights section */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: theme.palette.background.default, 
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Key Insights
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    color: theme.palette.warning.main,
                    mr: 1,
                    width: 32,
                    height: 32
                  }}
                >
                  <AttachMoneyIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2">
                  <strong>Most common question type:</strong> Salary queries (40%)
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1), 
                    color: theme.palette.info.main,
                    mr: 1,
                    width: 32,
                    height: 32
                  }}
                >
                  <AccessAlarmIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2">
                  <strong>Response peak times:</strong> 8-10 AM and 7-9 PM
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main,
                    mr: 1,
                    width: 32,
                    height: 32
                  }}
                >
                  <ScheduleIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2">
                  <strong>Average response time:</strong> 4.8 hours after message
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            {/* Response category chips */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Popular Response Categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(getResponseDistribution())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <Chip
                      key={category}
                      icon={getResponseIcon(category)}
                      label={`${formatResponseCategory(category)}: ${count}`}
                      sx={{ 
                        bgcolor: alpha(getResponseColor(category), 0.1),
                        color: getResponseColor(category),
                        borderColor: getResponseColor(category),
                        '&:hover': {
                          bgcolor: alpha(getResponseColor(category), 0.2),
                        }
                      }}
                      variant="outlined"
                    />
                  ))
                }
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResponseAnalytics;

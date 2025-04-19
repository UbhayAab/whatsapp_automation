import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider,
  useTheme,
  ButtonGroup,
  Button,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const MessageAnalytics = ({ leadData = [] }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [chartView, setChartView] = useState(0);

  // Process data for charts based on selected time range
  const processChartData = () => {
    // Create date labels based on selected time range
    let dateLabels = [];
    const today = new Date();
    
    if (timeRange === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dateLabels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      }
    } else if (timeRange === 'month') {
      // Last 30 days, grouped by week
      for (let i = 0; i < 4; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        dateLabels.push(`Week ${4-i}: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
      }
    } else if (timeRange === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        dateLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }

    // Sample data for demonstration
    // In a real implementation, this would filter and aggregate leadData based on dates
    
    // Messages sent
    const sentData = timeRange === 'week' ? 
      [35, 42, 38, 30, 45, 55, 65] : 
      timeRange === 'month' ? 
        [120, 150, 180, 210] : 
        [450, 480, 510, 530, 580, 620, 580, 640, 710, 740, 780, 850];
    
    // Messages delivered
    const deliveredData = timeRange === 'week' ? 
      [32, 38, 35, 27, 42, 50, 60] : 
      timeRange === 'month' ? 
        [110, 135, 165, 195] : 
        [420, 450, 480, 500, 550, 590, 550, 600, 680, 700, 740, 810];
    
    // Messages read
    const readData = timeRange === 'week' ? 
      [28, 34, 30, 24, 38, 45, 55] : 
      timeRange === 'month' ? 
        [95, 120, 150, 175] : 
        [380, 410, 440, 460, 510, 540, 510, 550, 630, 650, 690, 750];
    
    // Responses received
    const responseData = timeRange === 'week' ? 
      [15, 18, 14, 12, 20, 25, 30] : 
      timeRange === 'month' ? 
        [50, 65, 80, 95] : 
        [180, 200, 210, 220, 250, 270, 250, 280, 310, 320, 340, 370];

    return {
      dateLabels,
      sentData,
      deliveredData, 
      readData,
      responseData
    };
  };

  const { dateLabels, sentData, deliveredData, readData, responseData } = processChartData();

  // Message Volume Chart (Line)
  const messageVolumeOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      fontFamily: theme.typography.fontFamily,
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: dateLabels,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      markers: {
        width: 12,
        height: 12,
        radius: 12
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
      theme: theme.palette.mode
    }
  };

  const messageVolumeSeries = [
    {
      name: 'Sent',
      data: sentData
    },
    {
      name: 'Delivered',
      data: deliveredData
    },
    {
      name: 'Read',
      data: readData
    },
    {
      name: 'Responses',
      data: responseData
    }
  ];

  // Funnel Chart
  const funnelOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      },
      fontFamily: theme.typography.fontFamily,
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        distributed: true
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val;
      },
      style: {
        fontSize: '14px',
        fontWeight: 'normal',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: ['Responses', 'Read', 'Delivered', 'Sent'],
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    legend: {
      show: false
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode
    }
  };

  // Calculate totals for funnel chart
  const totalSent = sentData.reduce((a, b) => a + b, 0);
  const totalDelivered = deliveredData.reduce((a, b) => a + b, 0);
  const totalRead = readData.reduce((a, b) => a + b, 0);
  const totalResponses = responseData.reduce((a, b) => a + b, 0);

  const funnelSeries = [
    {
      name: 'Count',
      data: [totalResponses, totalRead, totalDelivered, totalSent]
    }
  ];

  // Response rates by time of day (bar chart)
  const timeOfDayOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      fontFamily: theme.typography.fontFamily,
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.secondary]
      }
    },
    xaxis: {
      categories: ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9-12 AM', '12-6 AM'],
      position: 'bottom',
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          colors: theme.palette.text.secondary
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
      theme: theme.palette.mode
    }
  };

  const timeOfDaySeries = [
    {
      name: 'Response Rate',
      data: [12, 19, 15, 22, 25, 18, 8]
    }
  ];

  return (
    <Card sx={{ mb: 3, boxShadow: theme.shadows[4] }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
            Message Analytics
          </Typography>
          
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

        <Tabs 
          value={chartView} 
          onChange={(e, newValue) => setChartView(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Message Volume" />
          <Tab label="Conversion Funnel" />
          <Tab label="Response by Time" />
        </Tabs>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            backgroundColor: theme.palette.background.default,
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {chartView === 0 && (
            <ReactApexChart
              options={messageVolumeOptions}
              series={messageVolumeSeries}
              type="line"
              height={350}
              width="100%"
            />
          )}
          
          {chartView === 1 && (
            <ReactApexChart
              options={funnelOptions}
              series={funnelSeries}
              type="bar"
              height={350}
              width="100%"
            />
          )}
          
          {chartView === 2 && (
            <ReactApexChart
              options={timeOfDayOptions}
              series={timeOfDaySeries}
              type="bar"
              height={350}
              width="100%"
            />
          )}
        </Paper>

        {/* Key Insights Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Key Insights
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                • Best time to send messages: <strong>6-9 PM</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                • Average response time: <strong>4.5 hours</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                • Most engaged demographic: <strong>25-34 age group</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MessageAnalytics;

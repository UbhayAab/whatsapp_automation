import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider,
  useTheme,
  LinearProgress
} from '@mui/material';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import { 
  MessageRounded, 
  CheckCircleRounded, 
  PersonRounded, 
  PeopleRounded,
  TrendingUpRounded,
  TrendingDownRounded,
  ShowChartRounded
} from '@mui/icons-material';

// Engagement metrics cards with animated counters and mini-charts
const EngagementMetrics = ({ stats }) => {
  const theme = useTheme();

  // Calculate engagement metrics
  const messagesDeliveryRate = stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0;
  const messageReadRate = stats.delivered > 0 ? (stats.read / stats.delivered) * 100 : 0;
  const responseRate = stats.read > 0 ? (stats.replied / stats.read) * 100 : 0;
  const conversionRate = stats.total > 0 ? (stats.replied / stats.total) * 100 : 0;

  // Configuration for mini charts
  const miniChartOptions = {
    chart: {
      type: 'area',
      height: 40,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      opacity: 0.3
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      marker: {
        show: false
      }
    }
  };

  // Sample data for mini-charts (would be replaced by real data)
  const deliveryRateData = {
    series: [{
      name: 'Delivery Rate',
      data: [70, 75, 85, 82, 90, messagesDeliveryRate]
    }],
    options: {
      ...miniChartOptions,
      colors: [theme.palette.success.main]
    }
  };

  const readRateData = {
    series: [{
      name: 'Read Rate',
      data: [50, 55, 60, 58, 62, messageReadRate]
    }],
    options: {
      ...miniChartOptions,
      colors: [theme.palette.info.main]
    }
  };

  const responseRateData = {
    series: [{
      name: 'Response Rate',
      data: [30, 25, 35, 40, 45, responseRate]
    }],
    options: {
      ...miniChartOptions,
      colors: [theme.palette.warning.main]
    }
  };

  const conversionRateData = {
    series: [{
      name: 'Conversion Rate',
      data: [15, 20, 18, 25, 22, conversionRate]
    }],
    options: {
      ...miniChartOptions,
      colors: [theme.palette.primary.main]
    }
  };

  // Performance change indicators (sample data)
  const deliveryRateChange = +5.3;
  const readRateChange = +2.8;
  const responseRateChange = -1.2;
  const conversionRateChange = +3.7;

  return (
    <Grid container spacing={3}>
      {/* Delivery Rate Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%', 
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[10]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'success.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <MessageRounded color="success" />
              </Box>
              <Typography variant="h6" component="div">
                Delivery Rate
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                <CountUp 
                  end={messagesDeliveryRate} 
                  decimals={1} 
                  duration={2} 
                  suffix="%" 
                />
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: deliveryRateChange >= 0 ? 'success.main' : 'error.main',
                  ml: 2
                }}
              >
                {deliveryRateChange >= 0 ? <TrendingUpRounded fontSize="small" /> : <TrendingDownRounded fontSize="small" />}
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {deliveryRateChange >= 0 ? '+' : ''}{deliveryRateChange}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {stats.delivered} of {stats.sent} messages delivered
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={messagesDeliveryRate} 
              color="success" 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 2,
                backgroundColor: theme.palette.success.lighter || theme.palette.grey[200]
              }} 
            />

            <Box sx={{ height: 40 }}>
              <ReactApexChart 
                options={deliveryRateData.options} 
                series={deliveryRateData.series} 
                type="area" 
                height={40} 
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Read Rate Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%', 
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[10]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'info.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <CheckCircleRounded color="info" />
              </Box>
              <Typography variant="h6" component="div">
                Read Rate
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                <CountUp 
                  end={messageReadRate} 
                  decimals={1} 
                  duration={2} 
                  suffix="%" 
                />
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: readRateChange >= 0 ? 'success.main' : 'error.main',
                  ml: 2
                }}
              >
                {readRateChange >= 0 ? <TrendingUpRounded fontSize="small" /> : <TrendingDownRounded fontSize="small" />}
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {readRateChange >= 0 ? '+' : ''}{readRateChange}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {stats.read} of {stats.delivered} messages read
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={messageReadRate} 
              color="info" 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 2,
                backgroundColor: theme.palette.info.lighter || theme.palette.grey[200]
              }} 
            />

            <Box sx={{ height: 40 }}>
              <ReactApexChart 
                options={readRateData.options} 
                series={readRateData.series} 
                type="area" 
                height={40} 
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Response Rate Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%', 
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[10]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'warning.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <PersonRounded color="warning" />
              </Box>
              <Typography variant="h6" component="div">
                Response Rate
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                <CountUp 
                  end={responseRate} 
                  decimals={1} 
                  duration={2} 
                  suffix="%" 
                />
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: responseRateChange >= 0 ? 'success.main' : 'error.main',
                  ml: 2
                }}
              >
                {responseRateChange >= 0 ? <TrendingUpRounded fontSize="small" /> : <TrendingDownRounded fontSize="small" />}
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {responseRateChange >= 0 ? '+' : ''}{responseRateChange}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {stats.replied} of {stats.read} leads responded
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={responseRate} 
              color="warning" 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 2,
                backgroundColor: theme.palette.warning.lighter || theme.palette.grey[200]
              }} 
            />

            <Box sx={{ height: 40 }}>
              <ReactApexChart 
                options={responseRateData.options} 
                series={responseRateData.series} 
                type="area" 
                height={40} 
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Conversion Rate Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%', 
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[10]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <ShowChartRounded color="primary" />
              </Box>
              <Typography variant="h6" component="div">
                Conversion Rate
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                <CountUp 
                  end={conversionRate} 
                  decimals={1} 
                  duration={2} 
                  suffix="%" 
                />
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: conversionRateChange >= 0 ? 'success.main' : 'error.main',
                  ml: 2
                }}
              >
                {conversionRateChange >= 0 ? <TrendingUpRounded fontSize="small" /> : <TrendingDownRounded fontSize="small" />}
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {conversionRateChange >= 0 ? '+' : ''}{conversionRateChange}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {stats.replied} of {stats.total} total leads
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={conversionRate} 
              color="primary" 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 2,
                backgroundColor: theme.palette.primary.lighter || theme.palette.grey[200]
              }} 
            />

            <Box sx={{ height: 40 }}>
              <ReactApexChart 
                options={conversionRateData.options} 
                series={conversionRateData.series} 
                type="area" 
                height={40} 
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EngagementMetrics;

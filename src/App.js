import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';

// Context
import { SupabaseProvider } from './context/SupabaseContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#25D366', // WhatsApp green
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <SupabaseProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<LeadManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </SupabaseProvider>
  );
}

export default App;

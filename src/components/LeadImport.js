import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  FileCopy as FileCopyIcon,
  DownloadDone as DownloadDoneIcon
} from '@mui/icons-material';
import { useSupabase } from '../context/SupabaseContext';
import CSVTemplateHelper from './CSVTemplateHelper';
import Papa from 'papaparse';

/**
 * Premium Lead Import Component
 * 
 * This component handles the import of lead data from CSV files with validation
 * and preview capabilities before submission to the database.
 */
const LeadImport = ({ onImportComplete }) => {
  const theme = useTheme();
  const csvInputRef = useRef(null);
  const { addLeadsFromCSV } = useSupabase();
  
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCSVData] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  
  const steps = ['Upload CSV File', 'Validate & Preview Data', 'Import Leads'];
  
  // Required fields for lead import
  const requiredFields = ['name', 'country_code', 'phone_number'];
  
  // Recommended columns for the lead template
  const recommendedColumns = [
    { field: 'name', description: 'Full name of the lead' },
    { field: 'country_code', description: 'Country code (e.g., 91 for India, 1 for US)' },
    { field: 'phone_number', description: 'Phone number without country code' },
    { field: 'interest_area', description: 'Area of nursing interest/specialty (optional)' },
    { field: 'email', description: 'Optional email address' },
    { field: 'custom_message', description: 'Optional custom message for initial contact' }
  ];
  
  // Handle CSV file upload
  const handleFileUpload = (event) => {
    setErrors([]);
    setSuccess(false);
    
    const file = event.target.files[0];
    if (!file) return;
    
    // Use Papa Parse to parse the CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCSVData(results.data);
        
        // Auto-detect field mapping
        const fieldsToMap = ['name', 'country_code', 'phone_number', 'interest_area', 'custom_message', 'email'];
        const headers = results.meta.fields;
        const mapping = {};
        
        // Try to map CSV headers to required fields
        fieldsToMap.forEach(field => {
          // Look for exact matches first
          const exactMatch = headers.find(header => 
            header.toLowerCase() === field.toLowerCase()
          );
          
          if (exactMatch) {
            mapping[field] = exactMatch;
            return;
          }
          
          // Look for partial matches
          const partialMatches = headers.filter(header => 
            header.toLowerCase().includes(field.toLowerCase()) ||
            field.toLowerCase().includes(header.toLowerCase())
          );
          
          if (partialMatches.length > 0) {
            mapping[field] = partialMatches[0];
          }
        });
        
        setFieldMapping(mapping);
        mapData(results.data, mapping);
        setActiveStep(1);
      },
      error: (error) => {
        setErrors([`Error parsing CSV: ${error.message}`]);
      }
    });
  };
  
  // Map CSV data to our expected format
  const mapData = (data, mapping) => {
    const mapped = data.map((row, index) => {
      const mappedRow = {
        id: index,
        name: mapping.name ? row[mapping.name] : '',
        country_code: mapping.country_code ? row[mapping.country_code] : '',
        phone_number: mapping.phone_number ? row[mapping.phone_number] : '',
        interest: mapping.interest_area ? row[mapping.interest_area] : '',
        custom_message: mapping.custom_message ? row[mapping.custom_message] : '',
        email: mapping.email ? row[mapping.email] : '',
        valid: true,
        errors: []
      };
      
      // Validate required fields
      if (!mappedRow.name || mappedRow.name.trim() === '') {
        mappedRow.valid = false;
        mappedRow.errors.push('Name is required');
      }
      
      // Validate country code and phone number
      if (!mappedRow.country_code || mappedRow.country_code.trim() === '') {
        mappedRow.valid = false;
        mappedRow.errors.push('Country code is required');
      }
      
      if (!mappedRow.phone_number || mappedRow.phone_number.trim() === '') {
        mappedRow.valid = false;
        mappedRow.errors.push('Phone number is required');
      }
      
      return mappedRow;
    });
    
    setMappedData(mapped);
    
    // Check if we have any validation errors
    const hasErrors = mapped.some(row => !row.valid);
    if (hasErrors) {
      setErrors([`Some rows contain validation errors. Please fix them before importing.`]);
    } else {
      setErrors([]);
    }
  };
  
  // Update the field mapping when user changes the mapping
  const handleMappingChange = (field, value) => {
    const updatedMapping = { ...fieldMapping, [field]: value };
    setFieldMapping(updatedMapping);
    mapData(csvData, updatedMapping);
  };
  
  // Handle importing the leads to the database
  const handleImport = async () => {
    setLoading(true);
    setErrors([]);
    
    // Filter out invalid rows
    const validRows = mappedData.filter(row => row.valid);
    
    // Check if we have any valid rows to import
    if (validRows.length === 0) {
      setErrors(['No valid leads to import. Please fix validation errors.']);
      setLoading(false);
      return;
    }
    
    // Format data for the database
    const formattedLeads = validRows.map(row => ({
      name: row.name,
      phone: CSVTemplateHelper.formatPhoneNumber(row.country_code + row.phone_number),
      interest: row.interest || '',
      email: row.email || '',
      custom_message: row.custom_message || ''
    }));
    
    try {
      await addLeadsFromCSV(formattedLeads);
      setSuccess(true);
      setActiveStep(2);
      
      // Notify parent component if provided
      if (onImportComplete) {
        onImportComplete(formattedLeads);
      }
    } catch (error) {
      setErrors([`Error importing leads: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reset to start over
  const handleReset = () => {
    setActiveStep(0);
    setCSVData([]);
    setMappedData([]);
    setFieldMapping({});
    setErrors([]);
    setSuccess(false);
    setLoading(false);
    
    // Clear the file input
    if (csvInputRef.current) {
      csvInputRef.current.value = '';
    }
  };
  
  // Download sample CSV template
  const handleDownloadTemplate = () => {
    const headers = ['name', 'country_code', 'phone_number', 'interest_area', 'email', 'custom_message'];
    const sampleData = [
      ['John Doe', '1', '2345678901', 'Critical Care', 'john.doe@example.com', ''],
      ['Jane Smith', '91', '7007334125', 'Pediatric Nursing', 'jane.smith@example.com', ''],
      ['Ubaay', '91', '7338120082', 'General Nursing', '', '']
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\\n';
    sampleData.forEach(row => {
      csvContent += row.join(',') + '\\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'borderplus_lead_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Generate content based on current step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Upload CSV
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="csv-file-input"
            />
            <Box
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 5,
                mb: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.03)
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 64,
                    height: 64
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
              <Typography variant="h6" gutterBottom>
                Upload Lead CSV File
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Upload a CSV file containing lead information with name, country code, phone number, and other details.
              </Typography>
              <Button
                variant="contained"
                component="label"
                htmlFor="csv-file-input"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Browse Files
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }}>
              <Chip label="OR" />
            </Divider>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownloadTemplate}
                sx={{ mr: 2 }}
              >
                Download CSV Template
              </Button>
              <Button
                variant="text"
                startIcon={<InfoIcon />}
                onClick={() => setOpenTemplateDialog(true)}
              >
                View Template Guide
              </Button>
            </Box>
          </Box>
        );
        
      case 1: // Validate & Preview
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Field Mapping & Data Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Verify the field mapping and preview the data before importing.
            </Typography>
            
            {/* Field Mapping Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Map CSV Columns to Lead Fields
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {recommendedColumns.slice(0, 3).map(column => (
                  <TextField
                    key={column.field}
                    select
                    label={`${column.field}${requiredFields.includes(column.field) ? ' *' : ''}`}
                    value={fieldMapping[column.field] || ''}
                    onChange={(e) => handleMappingChange(column.field, e.target.value)}
                    SelectProps={{ native: true }}
                    helperText={column.description}
                    sx={{ minWidth: 200, mb: 2 }}
                    required={requiredFields.includes(column.field)}
                    error={requiredFields.includes(column.field) && !fieldMapping[column.field]}
                  >
                    <option value=""></option>
                    {csvData.length > 0 && 
                      Object.keys(csvData[0]).map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))
                    }
                  </TextField>
                ))}
              </Box>
            </Paper>
            
            {/* Data Preview Section */}
            <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Row</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Country Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Interest</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappedData.map((row) => (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        bgcolor: row.valid ? 'inherit' : alpha(theme.palette.error.light, 0.1),
                        '&:hover': {
                          bgcolor: row.valid ? alpha(theme.palette.action.hover, 0.1) : alpha(theme.palette.error.light, 0.2),
                        }
                      }}
                    >
                      <TableCell>{row.id + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.country_code}</TableCell>
                      <TableCell>{row.phone_number}</TableCell>
                      <TableCell>{row.interest}</TableCell>
                      <TableCell>
                        {row.valid ? (
                          <Chip 
                            icon={<CheckIcon />} 
                            label="Valid" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                        ) : (
                          <Tooltip title={row.errors.join(', ')}>
                            <Chip 
                              icon={<ErrorIcon />} 
                              label="Error" 
                              size="small" 
                              color="error" 
                              variant="outlined"
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Error messages */}
            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}
            
            {/* Summary */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Typography variant="subtitle1" gutterBottom>
                Import Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Total Rows: ${mappedData.length}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Valid Leads: ${mappedData.filter(row => row.valid).length}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Rows with Errors: ${mappedData.filter(row => !row.valid).length}`}
                  />
                </ListItem>
              </List>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleReset}>
                Cancel
              </Button>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={
                    loading || 
                    errors.length > 0 || 
                    mappedData.filter(row => row.valid).length === 0
                  }
                  startIcon={loading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
                  sx={{ ml: 1 }}
                >
                  {loading ? 'Importing...' : 'Import Leads'}
                </Button>
              </Box>
            </Box>
          </Box>
        );
        
      case 2: // Import Results
        return (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            {success ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      width: 64,
                      height: 64
                    }}
                  >
                    <DownloadDoneIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" gutterBottom color="success.main">
                  Import Successful!
                </Typography>
                <Typography variant="body1" paragraph>
                  {`Successfully imported ${mappedData.filter(row => row.valid).length} leads.`}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{ mt: 2 }}
                >
                  Import More Leads
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" color="error">
                  Import Failed
                </Typography>
                <Typography variant="body1" paragraph>
                  There was an error importing your leads. Please try again.
                </Typography>
                {errors.length > 0 && (
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  onClick={handleReset}
                >
                  Try Again
                </Button>
              </>
            )}
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
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
            <CloudUploadIcon />
          </Avatar>
          <Typography variant="h5" component="h2">
            Import Leads
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        {/* Template Guide Dialog */}
        <Dialog
          open={openTemplateDialog}
          onClose={() => setOpenTemplateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Lead CSV Template Guide</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              The CSV template for importing leads should include the following columns:
            </DialogContentText>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Column Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Required</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recommendedColumns.map((column) => (
                    <TableRow key={column.field}>
                      <TableCell><code>{column.field}</code></TableCell>
                      <TableCell>
                        {requiredFields.includes(column.field) ? (
                          <Chip size="small" color="primary" label="Required" />
                        ) : (
                          <Chip size="small" variant="outlined" label="Optional" />
                        )}
                      </TableCell>
                      <TableCell>{column.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="subtitle2" gutterBottom>
              Sample Data Format:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.text.primary, 0.03),
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem',
                fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              name,country_code,phone_number,interest_area,email,custom_message
              John Doe,1,2345678901,Critical Care,john.doe@example.com,
              Jane Smith,91,7007334125,Pediatric Nursing,jane.smith@example.com,
              Ubaay,91,7338120082,General Nursing,,
            </Box>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Important Notes:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="The three required columns are: name, country_code, and phone_number" 
                  secondary="Make sure these columns exist with these exact names (case sensitive)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Country code should be entered without the + sign" 
                  secondary="Example: Use 1 for US, 91 for India"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone number should not include the country code" 
                  secondary="Just enter the local phone number without any special characters"
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTemplateDialog(false)}>Close</Button>
            <Button 
              variant="contained" 
              startIcon={<FileDownloadIcon />} 
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LeadImport;

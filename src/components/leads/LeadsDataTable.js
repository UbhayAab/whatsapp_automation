import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Message as MessageIcon,
  Error as ErrorIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Status chip colors for different lead statuses
const getStatusColor = (status) => {
  const statusMap = {
    'not_sent': 'default',
    'processing': 'secondary',
    'sent': 'primary',
    'delivered': 'info',
    'read': 'success',
    'failed': 'error',
    'follow_up_processing': 'secondary',
    'follow_up_sent': 'warning',
    'follow_up_failed': 'error',
    'second_follow_up_processing': 'secondary',
    'second_follow_up_sent': 'error',
    'second_follow_up_failed': 'error',
    'replied': 'success',
    'replied_to': 'success'
  };
  
  return statusMap[status] || 'default';
};

// Status text formatter for better readability
const formatStatus = (status) => {
  const statusMap = {
    'not_sent': 'Not Sent',
    'processing': 'Processing',
    'sent': 'Sent',
    'delivered': 'Delivered',
    'read': 'Read',
    'failed': 'Failed',
    'follow_up_processing': 'Processing Follow-up',
    'follow_up_sent': 'Follow-up Sent',
    'follow_up_failed': 'Follow-up Failed',
    'second_follow_up_processing': 'Processing 2nd Follow-up',
    'second_follow_up_sent': '2nd Follow-up Sent',
    'second_follow_up_failed': '2nd Follow-up Failed',
    'replied': 'Replied',
    'replied_to': 'Responded To'
  };
  
  return statusMap[status] || status;
};

// Get status icon based on status
const getStatusIcon = (status) => {
  const statusMap = {
    'not_sent': <MessageIcon fontSize="small" />,
    'processing': <AccessTimeIcon fontSize="small" />,
    'sent': <SendIcon fontSize="small" />,
    'delivered': <EmailIcon fontSize="small" />,
    'read': <CheckCircleIcon fontSize="small" />,
    'failed': <ErrorIcon fontSize="small" />,
    'follow_up_processing': <AccessTimeIcon fontSize="small" />,
    'follow_up_sent': <ScheduleIcon fontSize="small" />,
    'follow_up_failed': <ErrorIcon fontSize="small" />,
    'second_follow_up_processing': <AccessTimeIcon fontSize="small" />,
    'second_follow_up_sent': <ScheduleIcon fontSize="small" />,
    'second_follow_up_failed': <ErrorIcon fontSize="small" />,
    'replied': <WhatsAppIcon fontSize="small" />,
    'replied_to': <WhatsAppIcon fontSize="small" />
  };
  
  return statusMap[status] || <MessageIcon fontSize="small" />;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Responsive and interactive data table for leads
const LeadsDataTable = ({ 
  leads = [], 
  loading = false, 
  onSendMessage, 
  onManualFollowUp,
  onManualSecondFollowUp,
  onRefresh,
  onEditLead,
  onDeleteLead
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  
  // Handle changing page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle changing number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Handle opening the action menu for a lead
  const handleOpenMenu = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };
  
  // Handle closing the action menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Handle opening the status filter menu
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  // Handle closing the status filter menu
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  // Handle selecting a status filter
  const handleSelectFilter = (status) => {
    setStatusFilter(status);
    handleCloseFilterMenu();
    setPage(0);
  };
  
  // Filter the leads based on search term and status filter
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.interest?.toLowerCase().includes(searchLower);
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);
  
  // Sort the filtered leads
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      // Handle dates for proper sorting
      if (orderBy === 'created_at' || orderBy === 'last_sent_at' || orderBy === 'last_reply_at' || orderBy === 'updated_at') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      // Handle string values for proper sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
      
      // Handle null or undefined values
      if (aValue === null || aValue === undefined) return order === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return order === 'asc' ? 1 : -1;
      
      // Sort based on order
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredLeads, orderBy, order]);
  
  // Get only the leads for the current page
  const paginatedLeads = useMemo(() => {
    return sortedLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedLeads, page, rowsPerPage]);
  
  // Define table columns with sort capabilities
  const columns = [
    { 
      id: 'name', 
      label: 'Name', 
      sortable: true,
      minWidth: 170
    },
    { 
      id: 'phone', 
      label: 'Phone', 
      sortable: true,
      minWidth: 130
    },
    { 
      id: 'interest', 
      label: 'Interest', 
      sortable: true,
      minWidth: 130
    },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true,
      minWidth: 130
    },
    { 
      id: 'last_sent_at', 
      label: 'Last Contacted', 
      sortable: true,
      minWidth: 150
    },
    { 
      id: 'last_reply_at', 
      label: 'Last Reply', 
      sortable: true,
      minWidth: 150
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      sortable: false,
      minWidth: 100
    }
  ];
  
  // Define available status filters
  const statusFilters = [
    { value: 'all', label: 'All Statuses' },
    { value: 'not_sent', label: 'Not Sent' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'follow_up_sent', label: 'Follow-up Sent' },
    { value: 'second_follow_up_sent', label: '2nd Follow-up Sent' },
    { value: 'failed', label: 'Failed' }
  ];
  
  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
        borderRadius: 1
      }}
    >
      {/* Table Toolbar with Search and Filters */}
      <Toolbar sx={{ 
        pl: { sm: 2 }, 
        pr: { xs: 1, sm: 1 },
        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05)
      }}>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Lead Management
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Filter by status">
            <IconButton onClick={handleOpenFilterMenu}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleCloseFilterMenu}
          >
            {statusFilters.map((filter) => (
              <MenuItem 
                key={filter.value} 
                onClick={() => handleSelectFilter(filter.value)}
                selected={statusFilter === filter.value}
              >
                {statusFilter === filter.value && (
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={filter.label} 
                  inset={statusFilter !== filter.value}
                />
              </MenuItem>
            ))}
          </Menu>
          
          <Tooltip title="Refresh data">
            <IconButton onClick={onRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {/* Lead Statistics Summary */}
      <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredLeads.length} of {leads.length} leads
          {statusFilter !== 'all' && ` (filtered by: ${statusFilters.find(f => f.value === statusFilter)?.label || statusFilter})`}
          {searchTerm && ` (search: "${searchTerm}")`}
        </Typography>
      </Box>
      
      {/* Main Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="leads table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={lead.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.light', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mr: 1
                      }}
                    >
                      <PersonIcon color="primary" fontSize="small" />
                    </Box>
                    <Typography variant="body2">
                      {lead.name || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {lead.phone || 'N/A'}
                </TableCell>
                <TableCell>
                  {lead.interest || 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(lead.status)}
                    label={formatStatus(lead.status)}
                    color={getStatusColor(lead.status)}
                    size="small"
                    variant={lead.replied ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell>
                  {formatDate(lead.last_sent_at)}
                </TableCell>
                <TableCell>
                  {formatDate(lead.last_reply_at)}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="lead actions"
                    onClick={(event) => handleOpenMenu(event, lead)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  {loading ? (
                    <Typography variant="body1">Loading leads...</Typography>
                  ) : (
                    <Typography variant="body1">
                      {filteredLeads.length === 0 && leads.length > 0 ? 
                        'No leads match your filters' : 
                        'No leads available. Upload leads to get started.'}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredLeads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem 
          onClick={() => {
            onSendMessage(selectedLead);
            handleCloseMenu();
          }}
          disabled={selectedLead?.status !== 'not_sent' && selectedLead?.status !== 'failed'}
        >
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Send Message" />
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onManualFollowUp(selectedLead);
            handleCloseMenu();
          }}
          disabled={
            !['sent', 'delivered', 'read'].includes(selectedLead?.status) || 
            selectedLead?.replied
          }
        >
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Send Follow-up" />
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onManualSecondFollowUp(selectedLead);
            handleCloseMenu();
          }}
          disabled={
            selectedLead?.status !== 'follow_up_sent' || 
            selectedLead?.replied
          }
        >
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Send 2nd Follow-up" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => {
            onEditLead(selectedLead);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Lead" />
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onDeleteLead(selectedLead);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete Lead" />
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default LeadsDataTable;

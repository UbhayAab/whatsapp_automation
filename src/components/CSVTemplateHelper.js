import Papa from 'papaparse';

// This function generates the proper CSV template for lead uploads
export const generateCSVTemplate = () => {
  const templateData = [
    {
      name: 'John Doe',
      country_code: '1',
      phone_number: '2345678901'
    },
    {
      name: 'Jane Smith',
      country_code: '91',
      phone_number: '7007334125'
    },
    {
      name: 'Ubaay',
      country_code: '91',
      phone_number: '7338120082'
    }
  ];
  
  const csv = Papa.unparse(templateData);
  return csv;
};

// This function converts the uploaded CSV to the right format for Supabase
export const convertCSVToLeads = (csvData) => {
  console.log('=== Converting CSV Data ===');
  console.log('Original CSV data:', csvData);
  
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
    console.error('Invalid CSV data structure');
    return { success: false, error: 'Invalid CSV data structure' };
  }
  
  try {
    // First, attempt to fix any column name issues
    const formattedData = csvData.map(row => {
      // Create a new row with lowercased keys
      const newRow = {};
      Object.keys(row).forEach(key => {
        // Convert the key to lowercase
        const lowerKey = key.toLowerCase().trim();
        newRow[lowerKey] = row[key];
      });
      
      // Combine country_code and phone_number if they exist separately
      if (newRow['country_code'] && newRow['phone_number']) {
        // Ensure phone_number is treated as a string to prevent scientific notation issues
        const phoneStr = String(newRow['phone_number']).replace(/[^\d]/g, '');
        
        // Format the country code correctly (remove non-digits except +)
        let countryCode = String(newRow['country_code']).replace(/[^\d+]/g, '');
        
        // Ensure country code starts with +
        if (!countryCode.startsWith('+')) {
          countryCode = '+' + countryCode;
        }
        
        // Store the full international format phone number
        newRow['phone'] = countryCode + phoneStr;
        
        console.log('Combined phone number:', newRow['phone']);
      } else if (newRow['phone']) {
        // Ensure existing phone is formatted correctly
        let phone = String(newRow['phone']);
        
        // If phone is in scientific notation (contains 'e' or 'E')
        if (phone.includes('e') || phone.includes('E')) {
          try {
            // Convert from scientific notation to a full number
            const fullNum = Number(phone).toFixed(0);
            phone = String(fullNum);
            console.log('Converted from scientific notation:', phone);
          } catch (e) {
            console.error('Failed to convert scientific notation:', e);
          }
        }
        
        // Ensure it starts with a +
        if (!phone.startsWith('+')) {
          phone = '+' + phone;
        }
        
        newRow['phone'] = phone;
      }
      
      return newRow;
    });
    
    console.log('Formatted data:', formattedData);
    
    // Validate required fields
    const validatedData = formattedData.filter(row => {
      const hasName = row.name && row.name.trim() !== '';
      const hasPhone = row.phone && row.phone.trim() !== '' || 
                      (row.country_code && row.phone_number); // Consider valid if separate phone fields exist
      
      if (!hasName || !hasPhone) {
        console.log('Skipping invalid row:', row);
      }
      
      return hasName && hasPhone;
    });
    
    console.log(`Validated ${validatedData.length} of ${formattedData.length} rows`);
    
    return { 
      success: true, 
      data: validatedData,
      originalCount: csvData.length,
      validCount: validatedData.length
    };
  } catch (error) {
    console.error('Error converting CSV data:', error);
    return { success: false, error: error.message };
  }
};

// Format phone number with international format
export const formatPhoneNumber = (phoneInput) => {
  if (!phoneInput) return '';
  
  // If it's already in proper format with + prefix, return as is
  if (phoneInput.startsWith('+')) return phoneInput;
  
  // If country code and number are separate, need to combine them
  return '+' + phoneInput.replace(/[^\d]/g, '');
};

// Export as default to fix the import in LeadManagement.js
export default { generateCSVTemplate, convertCSVToLeads, formatPhoneNumber };

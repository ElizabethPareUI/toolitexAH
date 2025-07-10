import React from 'react';
import axios from 'axios';

const DebugInfo = () => {
  const handleTest = async () => {
    console.log('=== DEBUG INFO ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('Axios baseURL:', axios.defaults.baseURL);
    
    try {
      console.log('Testing connection to /api/auth/test-connection...');
      const response = await axios.get('/api/auth/test-connection');
      console.log('✅ Test connection successful:', response.data);
    } catch (error) {
      console.error('❌ Test connection failed:', error.message);
      
      // Try registration endpoint instead
      try {
        console.log('Testing registration endpoint...');
        const testData = {
          name: 'Test User',
          email: `test${Date.now()}@test.com`,
          password: 'TestPass123@'
        };
        const regResponse = await axios.post('/api/auth/register', testData);
        console.log('✅ Registration test successful:', regResponse.data);
      } catch (regError) {
        console.error('❌ Registration test failed:', regError.message);
        console.log('Registration error details:', regError);
      }
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>ENV: {process.env.NODE_ENV}</div>
      <div>API: {process.env.REACT_APP_API_URL || 'undefined'}</div>
      <div>Axios: {axios.defaults.baseURL || 'undefined'}</div>
      <button onClick={handleTest} style={{ marginTop: '5px', fontSize: '11px' }}>
        Test Connection
      </button>
    </div>
  );
};

export default DebugInfo;

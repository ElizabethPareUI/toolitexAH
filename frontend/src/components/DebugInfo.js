import React from 'react';
import axios from 'axios';

const DebugInfo = () => {
  const handleTest = async () => {
    console.log('=== DEBUG INFO ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('Axios baseURL:', axios.defaults.baseURL);
    
    try {
      console.log('Testing connection...');
      const response = await axios.get('/api/auth/test-connection');
      console.log('✅ Connection successful:', response.data);
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('Error details:', error);
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

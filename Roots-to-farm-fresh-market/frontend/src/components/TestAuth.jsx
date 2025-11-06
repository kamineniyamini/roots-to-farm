import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const TestAuth = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const testAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data.user);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Authentication Test</h3>
      <p><strong>User:</strong> {user ? user.name : 'Not logged in'}</p>
      <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      
      <button onClick={testAuth} style={{ margin: '10px 0' }}>
        Test Auth API Call
      </button>
      
      {profile && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
          <strong>Profile Data:</strong>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#ffebee', color: '#c62828' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default TestAuth;
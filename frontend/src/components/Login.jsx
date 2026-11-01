import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login({ onLoginSuccess }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f172a',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h2>Welcome to Nova AI</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Please sign in with your Google account to continue
        </p>

        <GoogleLogin
          onSuccess={credentialResponse => {
            try {
              const decoded = jwtDecode(credentialResponse.credential);
              console.log("Logged in user:", decoded);
              
              // লোকালস্টোরেজে ইউজারের তথ্য সেভ করা
              localStorage.setItem('nova_user', JSON.stringify(decoded));
              
              // যদি প্যারেন্ট কম্পোনেন্ট থেকে কোনো সাকসেস ফাংশন পাস করা হয়ে থাকে
              if (onLoginSuccess) {
                onLoginSuccess(decoded);
              } else {
                window.location.reload(); // পেজ রিলোড করে চ্যাট পেজে যাওয়ার জন্য
              }
            } catch (error) {
              console.error("Token decoding failed:", error);
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </div>
  );
}
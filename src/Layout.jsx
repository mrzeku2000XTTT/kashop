import React, { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    // Load KasperoPay widget script if not already loaded
    if (!document.getElementById('kaspero-pay-script')) {
      const script = document.createElement('script');
      script.id = 'kaspero-pay-script';
      script.src = 'https://kaspa-store.com/pay/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* KasperoPay widget container - MUST be in root layout */}
      <div 
        id="kaspero-pay-button"
        data-merchant="kpm_hocgtdnj"
        style={{ display: 'none' }}
      />
      
      {children}
    </>
  );
}
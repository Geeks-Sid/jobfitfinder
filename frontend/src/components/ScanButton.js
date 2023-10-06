import React from 'react';

const ScanButton = ({ isScanning, handleScanClick }) => (
  <button onClick={handleScanClick}>
    {isScanning ? 'Scanning...' : 'Scan Resume'}
  </button>
);

export default ScanButton;

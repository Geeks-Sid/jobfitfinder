import React, { useState } from 'react';
import './MainContent.css';
import axios from 'axios';

const MainContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResponse, setScanResponse] = useState(null);

  const handleFileUpload = (event) => {
    // Logic for file upload can go here
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/upload', formData)
      .then(response => {
        console.log('File uploaded successfully');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const handleScanClick = () => {
    if (isScanning) return;  // Don't re-initiate if already scanning

    setIsScanning(true);
    
    axios.post('/scan')
      .then(response => {
        setScanResponse(response.data);
        setIsScanning(false);
      })
      .catch(error => {
        console.error(error);
        setIsScanning(false);
      });
  };

  return (
    <main>
      <input type="file" id="resume" name="resume" onChange={handleFileUpload} />
      <button onClick={handleScanClick}>
        {isScanning ? 'Scanning...' : 'Scan Resume'}
      </button>
      {isScanning && <p>Scanning...</p>}
      {!isScanning && scanResponse && (
        <div className="response-box">
          <pre>{JSON.stringify(scanResponse, null, 2)}</pre>
        </div>
      )}
      {!isScanning && !scanResponse && <p>Ready to scan.</p>}
    </main>
  );
}

export default MainContent;

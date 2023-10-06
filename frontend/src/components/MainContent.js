import React, { useState } from 'react';
import './MainContent.css';
import axios from 'axios';

const MainContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResponse, setScanResponse] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const newFormData = new FormData();
    newFormData.append('resume', file);
    setFormData(newFormData);
  };

  const handleScanClick = () => {
    if (isScanning || !formData) return;
    setIsScanning(true);

    axios.post('http://localhost:3001/scan', formData)
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
};

export default MainContent;

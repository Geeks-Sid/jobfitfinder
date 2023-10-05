import React, { useState } from 'react';
import './MainContent.css';
 import axios from 'axios';

const MainContent = () => {
  const [isScanning, setIsScanning] = useState(false);
   const [scanResponse, setScanResponse] = useState(null);

  const handleFileUpload = (event) => {
    // Logic for file upload can go here
    console.log("File uploaded");
  };

  const handleScanClick = () => {
    if (isScanning) return;  // Don't re-initiate if already scanning

    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
       axios.post('/scan')
         .then(response => {
           setScanResponse(response.data);
         })
         .catch(error => {
           console.error(error);
         });
    }, 3000); // Simulate a 3-second scan operation
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
import React, { useState } from 'react';
import './MainContent.css';

const MainContent = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = (event) => {
    // Logic for file upload can go here
    console.log("File uploaded");
  };

  const handleScanClick = () => {
    if (isScanning) return;  // Don't re-initiate if already scanning

    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
    }, 3000); // Simulate a 3-second scan operation
  };

  return (
    <main>
      <input type="file" id="resume" name="resume" onChange={handleFileUpload} />
      <button onClick={handleScanClick}>
        {isScanning ? 'Scanning...' : 'Scan Resume'}
      </button>
      {isScanning && <p>Scanning...</p>}
      {!isScanning && <p>Ready to scan.</p>}
    </main>
  );
}

export default MainContent;

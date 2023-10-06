import React, { useState } from 'react';
import './MainContent.css';
import axios from 'axios';
import FileUpload from './FileUpload';
import ResponseBox from './ResponseBox';

const MainContent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResponse, setScanResponse] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleScanClick = async () => {
    if (isScanning || !selectedFile) return;

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setIsScanning(true);
    try {
      const response = await axios.post('http://localhost:3001/scan', formData);
      setScanResponse(response.data);
    } catch (error) {
      console.error('Error scanning:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateQuestionClick = async () => {
    if (!selectedSkill) return;
    try {
      const response = await axios.post('http://localhost:3001/genque', { skill: selectedSkill });
      console.log('Generated question:', response.data);
    } catch (error) {
      console.error('Error generating question:', error);
    }
  };

  return (
    <main>
      <FileUpload handleFileUpload={handleFileUpload} />
      <button 
        onClick={handleScanClick}
        disabled={!selectedFile || isScanning}
      >
        {isScanning ? 'Scanning...' : 'Scan Resume'}
      </button>
      {isScanning && <p>Scanning...</p>}
      {!isScanning && scanResponse.length > 0 && (
        <ResponseBox 
          scanResponse={scanResponse} 
          selectedSkill={selectedSkill} 
          setSelectedSkill={setSelectedSkill} 
          handleGenerateQuestionClick={handleGenerateQuestionClick} 
        />
      )}
      {!isScanning && scanResponse.length === 0 && <p>Ready to scan.</p>}
      <button 
        onClick={handleGenerateQuestionClick}
        disabled={!selectedSkill}
      >
        Ask Questions
      </button>
    </main>
  );
};

export default MainContent;

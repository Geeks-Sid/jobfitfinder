import React from 'react';

const FileUpload = ({ handleFileUpload }) => (
  <input type="file" id="resume" name="resume" onChange={handleFileUpload} />
);

export default FileUpload;

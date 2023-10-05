import React from 'react';
import './MainContent.css';

const MainContent = () => {
  return (
    <main>
      <input type="file" id="resume" name="resume" />
      <button>Scan Resume</button>
    </main>
  );
}

export default MainContent;

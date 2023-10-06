import React from 'react';

const ResponseBox = ({ scanResponse, selectedSkill, setSelectedSkill, handleGenerateQuestionClick }) => (
  <div className="response-box">
    <pre>{JSON.stringify(scanResponse, null, 2)}</pre>
    <select onChange={e => setSelectedSkill(e.target.value)} value={selectedSkill}>
      <option value="" disabled>Select a skill</option>
      {scanResponse.map((skill) => (
        <option key={skill} value={skill}>{skill}</option>
      ))}
    </select>
    <button onClick={handleGenerateQuestionClick}>Generate Question</button>
  </div>
);

export default ResponseBox;

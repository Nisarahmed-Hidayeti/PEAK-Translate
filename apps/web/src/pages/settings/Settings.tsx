import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';

const Settings: React.FC = () => {
  const { vocabulary, loadVocabulary } = useVocabulary();

  const handleClearVocabulary = () => {
    if (window.confirm('Are you sure you want to delete all vocabulary? This cannot be undone.')) {
      localStorage.removeItem('peak-translation-vocabulary');
      loadVocabulary();
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>About</h2>
        <p>Peak Translation is a language learning tool that helps you understand, learn, and remember words as you browse the web.</p>
        <p>Version: 0.1.0</p>
      </div>
      
      <div className="settings-section">
        <h2>Data</h2>
        <p>Your vocabulary is stored locally in your browser.</p>
        <button className="danger-button" onClick={handleClearVocabulary}>
          Clear All Vocabulary
        </button>
      </div>
      
      <div className="settings-section">
        <h2>Export / Import</h2>
        <p>
          You can export and import your vocabulary from the extension's options page.
          This allows you to backup your vocabulary or transfer it to another device.
        </p>
      </div>
      
      <div className="settings-section">
        <h2>Language Settings</h2>
        <p>
          Configure your native and learning languages in the Firefox extension's options page.
          To access it: right-click the Peak Translation icon &rarr; Options.
        </p>
      </div>
    </div>
  );
};

export default Settings;

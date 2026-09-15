import React, { useState } from 'react';
import { useVocabulary } from '../../context/VocabularyContext';

const Settings: React.FC = () => {
  const { vocabulary, loadVocabulary } = useVocabulary();
  const [exportData, setExportData] = useState<string>('');
  const [importing, setImporting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Language settings (would ideally sync with extension)
  const [nativeLanguage, setNativeLanguage] = useState<'tr' | 'en' | 'es' | 'fr' | 'de'>('tr');
  const [learningLanguage, setLearningLanguage] = useState<'tr' | 'en' | 'es' | 'fr' | 'de'>('en');

  // TTS settings
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [ttsVolume, setTtsVolume] = useState<number>(0.8);

  const handleClearVocabulary = () => {
    if (window.confirm('Are you sure you want to delete all vocabulary? This cannot be undone.')) {
      localStorage.removeItem('peak-translation-vocabulary');
      loadVocabulary();
    }
  };

  const handleExportVocabulary = () => {
    setExporting(true);
    const vocabularyJson = JSON.stringify(vocabulary, null, 2);
    setExportData(vocabularyJson);
    // Trigger download
    const blob = new Blob([vocabularyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'peak-translation-vocabulary.json';
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleImportVocabulary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          // Validate each item has required fields
          const validItems = importedData.filter((item: any) =>
            item.word &&
            item.translations &&
            Array.isArray(item.translations) &&
            item.sourceLanguage &&
            item.targetLanguage
          );

          if (validItems.length > 0) {
            // Clear current vocabulary and replace with imported
            localStorage.setItem('peak-translation-vocabulary', JSON.stringify(validItems));
            loadVocabulary();
            alert(`Successfully imported ${validItems.length} vocabulary items`);
          } else {
            alert('No valid vocabulary items found in the file');
          }
        } else {
          alert('Invalid file format: expected an array of vocabulary items');
        }
      } catch (error) {
        alert('Error parsing JSON file: ' + error.message);
      } finally {
        setImporting(false);
        event.target.value = ''; // Reset file input
      }
    };
    reader.onerror = () => {
      alert('Error reading file');
      setImporting(false);
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = () => {
    // In a real implementation, these would be saved to storage and synced with extension
    alert('Settings saved! Note: Language settings currently only affect the web dashboard. ' +
      'To change extension language settings, use the extension options page.');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Language Settings</h2>
        <p><strong>Note:</strong> Language settings in the web dashboard are independent of the extension. ' +
          'To change extension language settings, use the extension options page (right-click icon → Options).</p>
        <div className="language-settings">
          <div>
            <label htmlFor="native-language">Native Language:</label>
            <select
              id="native-language"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value as any)}
            >
              <option value="tr">Turkish</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label htmlFor="learning-language">Language to Learn:</label>
            <select
              id="learning-language"
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value as any)}
            >
              <option value="tr">Turkish</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Text-to-Speech Settings</h2>
        <div className="tts-settings">
          <div>
            <label htmlFor="tts-enabled">Enable Pronunciation:</label>
            <input
              type="checkbox"
              id="tts-enabled"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
          </div>
          <div>
            <label htmlFor="tts-rate">Speech Rate:</label>
            <input
              type="range"
              id="tts-rate"
              min="0.5"
              max="2.0"
              step="0.1"
              value={ttsRate}
              onChange={(e) => setTtsRate(parseFloat(e.target.value))}
            />
            <span>{ttsRate.toFixed(1)}x</span>
          </div>
          <div>
            <label htmlFor="tts-volume">Volume:</label>
            <input
              type="range"
              id="tts-volume"
              min="0"
              max="1"
              step="0.1"
              value={ttsVolume}
              onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
            />
            <span>{(ttsVolume * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Data Management</h2>
        <p>Your vocabulary is stored locally in your browser.</p>
        <div className="data-actions">
          <button
            className="warning-button"
            onClick={handleClearVocabulary}
            disabled={vocabulary.length === 0}
          >
            Clear All Vocabulary ({vocabulary.length} words)
          </button>
          <button
            className="secondary-button"
            onClick={handleExportVocabulary}
            disabled={exporting || vocabulary.length === 0}
          >
            {exporting ? 'Exporting...' : 'Export Vocabulary'}
          </button>
          <div style={{ margin: '10px 0' }}>
            <input
              type="file"
              accept=".json"
              onChange={handleImportVocabulary}
              style={{ display: 'none' }}
              id="vocabulary-file-input"
            />
            <button
              className="secondary-button"
              onClick={() => document.getElementById('vocabulary-file-input')?.click()}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import Vocabulary'}
            </button>
          </div>
        </div>

        {exportData && !exporting && (
          <div className="export-preview">
            <h3>Export Preview:</h3>
            <textarea
              value={exportData}
              readOnly
              style={{ width: '100%', height: '150px', fontFamily: 'monospace' }}
            />
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2>About</h2>
        <p>Peak Translation is a language learning tool that helps you understand, learn, and remember words as you browse the web.</p>
        <p>Version: 0.1.0</p>
        <p>Features:</p>
        <ul>
          <li>Text translation with selection classification</li>
          <li>Vocabulary saving with context and pronunciation</li>
          <li>Companion web dashboard</li>
          <li>Text-to-speech pronunciation</li>
          <li>Keyboard shortcuts for quick access</li>
          <li>Privacy-first design - data stored locally</li>
        </ul>
      </div>

      <div className="settings-section">
        <button className="primary-button" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
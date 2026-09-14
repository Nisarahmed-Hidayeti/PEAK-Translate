import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';
import { useParams, Link } from 'react-router-dom';
import { VocabularyItem } from '@peak-translation/core';

const VocabularyDetail: React.FC = () => {
  const { vocabulary, removeVocabulary, updateVocabulary } = useVocabulary();
  const { id } = useParams<{ id: string }>();
  
  const word = vocabulary.find(item => item.id === id);
  
  if (!word) {
    return <div>Word not found</div>;
  }

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this word?')) {
      removeVocabulary(id);
      // Navigate back to vocabulary list
      window.location.href = '/vocabulary';
    }
  };

  const handleEdit = (field: keyof VocabularyItem, value: string) => {
    updateVocabulary(id, { [field]: value });
  };

  return (
    <div className="vocabulary-detail">
      <div className="vocabulary-detail-header">
        <Link to="/vocabulary" className="back-link">
          ← Back to Vocabulary
        </Link>
        <h1>{word.word}</h1>
      </div>
      
      <div className="vocabulary-detail-body">
        <div className="translation-section">
          <h2>Translation</h2>
          <p className="translation-text">{word.translations?.[0] || 'No translation available'}</p>
        </div>
        
        {word.definition && (
          <div className="definition-section">
            <h2>Definition</h2>
            <p>{word.definition}</p>
          </div>
        )}
        
        {word.examples && word.examples.length > 0 && (
          <div className="examples-section">
            <h2>Examples</h2>
            <ul className="examples-list">
              {word.examples.map((example, index) => (
                <li key={index} className="example-item">
                  <p>{example}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {word.phonetic && (
          <div className="pronunciation-section">
            <h2>Pronunciation</h2>
            <div className="phonetic-text">/{word.phonetic}/</div>
            <button className="audio-button">
              🔊 Play Pronunciation
            </button>
          </div>
        )}
        
        <div className="metadata-section">
          <h2>Details</h2>
          <p><strong>Added:</strong> {new Date(word.createdAt).toLocaleDateString()}</p>
          <p><strong>Language Pair:</strong> 
            {word.sourceLanguage} → {word.targetLanguage}
          </p>
          {word.context && (
            <div className="context-section">
              <h3>Context</h3>
              <p>{word.context}</p>
            </div>
          )}
          {word.sourceUrl && (
            <div className="source-section">
              <h3>Source</h3>
              <p>
                <a href={word.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {word.sourceTitle || 'View source'}
                </a>
              </p>
            </div>
          )}
        </div>
        
        <div className="actions-section">
          <button className="edit-button" onClick={() => {
            // In a real implementation, we would open an edit modal
            alert('Edit functionality would be implemented here');
          }}>
            Edit Word
          </button>
          <button className="remove-button" onClick={handleRemove}>
            Remove Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyDetail;

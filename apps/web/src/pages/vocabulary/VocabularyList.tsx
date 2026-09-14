import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';
import { Link } from 'react-router-dom';

const VocabularyList: React.FC = () => {
  const { vocabulary, removeVocabulary } = useVocabulary();

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this word?')) {
      removeVocabulary(id);
    }
  };

  return (
    <div className="vocabulary-list">
      <h1>My Vocabulary</h1>
      {vocabulary.length === 0 ? (
        <p className="empty-state">Your vocabulary is empty. Start translating words to add them here!</p>
      ) : (
        <>
          <input 
            type="text" 
            placeholder="Search vocabulary..." 
            className="search-input"
            onChange={(e) => {
              // In a real implementation, we would filter the vocabulary list
              console.log('Search:', e.target.value);
            }}
          />
          <ul className="vocabulary-list-items">
            {vocabulary.map((item) => (
              <li key={item.id} className="vocabulary-item">
                <div className="vocabulary-item-content">
                  <Link to={`/vocabulary/${item.id}`} className="vocabulary-link">
                    <div className="word">{item.word}</div>
                    <div className="translation">{item.translations?.[0]}</div>
                  </Link>
                  <div className="details">
                    <span className="date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default VocabularyList;

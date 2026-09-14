import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';

const Dashboard: React.FC = () => {
  const { vocabulary, loadVocabulary } = useVocabulary();

  // For now, we'll just show some basic stats
  // In a real implementation, we might track study streaks, etc.
  const totalWords = vocabulary.length;
  const recentWords = vocabulary
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <h1>Welcome to Peak Translation</h1>
      <p className="tagline">Understand. Learn. Remember.</p>
      
      <div className="stats">
        <div className="stat-card">
          <h2>{totalWords}</h2>
          <p>Words Learned</p>
        </div>
        <div className="stat-card">
          <h2>{recentWords.length}</h2>
          <p>Recent Words</p>
        </div>
        <div className="stat-card">
          <h2>5 min</h2>
          <p>Average Session</p>
        </div>
      </div>
      
      <div className="recent-section">
        <h2>Recent Words</h2>
        {recentWords.length > 0 ? (
          <ul className="recent-words-list">
            {recentWords.map(word => (
              <li key={word.id} className="recent-word-item">
                <span className="word">{word.word}</span>
                <span className="translation">{word.translations?.[0]}</span>
                <span className="date">
                  {new Date(word.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No words yet. Start translating to build your vocabulary!</p>
        )}
      </div>
      
      <div className="cta-section">
        <p>Ready to learn more words?</p>
        <button className="primary-button" onClick={() => window.dispatchEvent(new Event('storage'))}>
          Go to Vocabulary
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

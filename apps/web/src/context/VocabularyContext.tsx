import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem } from '@peak-translation/core';

interface VocabularyContextProps {
  vocabulary: VocabularyItem[];
  addVocabulary: (item: Omit<VocabularyItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeVocabulary: (id: string) => void;
  updateVocabulary: (id: string, updates: Partial<VocabularyItem>) => void;
  loadVocabulary: () => Promise<void>;
}

const VocabularyContext = createContext<VocabularyContextProps | undefined>(undefined);

export const VocabularyProvider = ({ children }: { children: React.ReactNode }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load vocabulary from localStorage (simulating shared storage)
  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      const stored = localStorage.getItem('peak-translation-vocabulary');
      if (stored) {
        const parsed = JSON.parse(stored);
        setVocabulary(parsed);
      }
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  };

  const addVocabulary = (item: Omit<VocabularyItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newItem: VocabularyItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    
    setVocabulary(prev => [...prev, newItem]);
    // Save to localStorage
    localStorage.setItem('peak-translation-vocabulary', JSON.stringify([...vocabulary, newItem]));
  };

  const removeVocabulary = (id: string) => {
    setVocabulary(prev => prev.filter(item => item.id !== id));
    // Save to localStorage
    localStorage.setItem('peak-translation-vocabulary', JSON.stringify(vocabulary.filter(item => item.id !== id)));
  };

  const updateVocabulary = (id: string, updates: Partial<VocabularyItem>) => {
    setVocabulary(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    // Save to localStorage
    const updated = vocabulary.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    localStorage.setItem('peak-translation-vocabulary', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="context-loading">
        Loading vocabulary...
      </div>
    );
  }

  return (
    <VocabularyContext.Provider value={{
      vocabulary,
      addVocabulary,
      removeVocabulary,
      updateVocabulary,
      loadVocabulary
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};

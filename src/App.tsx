import React, { useState, useEffect } from 'react';
import { ToolId, SavedItem } from './types';
import { TOOLS } from './data/tools';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { LibraryModal } from './components/LibraryModal';
import { PresetsModal } from './components/PresetsModal';

export default function App() {
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [activePresetInputs, setActivePresetInputs] = useState<Record<string, any> | undefined>(undefined);

  // Saved items from LocalStorage
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('ai_content_creator_library');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal states
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Sync saved items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_content_creator_library', JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to persist library:', e);
    }
  }, [savedItems]);

  const handleSaveItem = (item: SavedItem) => {
    setSavedItems(prev => [item, ...prev]);
  };

  const handleDeleteSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearLibrary = () => {
    if (window.confirm('Are you sure you want to clear your saved library?')) {
      setSavedItems([]);
    }
  };

  const handleSelectPreset = (toolId: ToolId, inputs: Record<string, any>) => {
    setActiveToolId(toolId);
    setActivePresetInputs(inputs);
  };

  const activeToolMeta = TOOLS.find(t => t.id === activeToolId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        savedCount={savedItems.length}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onResetToGrid={() => {
          setActiveToolId(null);
          setActivePresetInputs(undefined);
        }}
        activeToolTitle={activeToolMeta?.title}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeToolId ? (
          <ToolWorkspace
            toolId={activeToolId}
            onBack={() => {
              setActiveToolId(null);
              setActivePresetInputs(undefined);
            }}
            onSaveItem={handleSaveItem}
            savedItemIds={savedItems.map(s => s.id)}
            initialInputs={activePresetInputs}
          />
        ) : (
          <ToolGrid
            onSelectTool={id => {
              setActiveToolId(id);
              setActivePresetInputs(undefined);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        AI Content Creator • Powered by Gemini 3.6 Flash Server Engine
      </footer>

      {/* Modals */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedItems={savedItems}
        onDeleteItem={handleDeleteSavedItem}
        onClearAll={handleClearLibrary}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ToolId, SavedItem } from './types';
import { TOOLS } from './data/tools';
import { Header } from './components/Header';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { AIAssistant } from './components/AIAssistant';
import { MediaTools } from './components/MediaTools';
import { VideoTools } from './components/VideoTools';
import { AudioTools } from './components/AudioTools';
import { LibraryModal } from './components/LibraryModal';
import { PresetsModal } from './components/PresetsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ai_tools');
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [activePresetInputs, setActivePresetInputs] = useState<Record<string, any> | undefined>(
    undefined
  );

  // Saved items from LocalStorage
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('modern_media_library');
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
      localStorage.setItem('modern_media_library', JSON.stringify(savedItems));
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
    setActiveTab('ai_tools');
    setActiveToolId(toolId);
    setActivePresetInputs(inputs);
  };

  const handleSelectTool = (toolId: ToolId) => {
    if (toolId === 'ai_assistant') {
      setActiveTab('ai_assistant');
      setActiveToolId(null);
    } else if (toolId === 'media_tools') {
      setActiveTab('media_tools');
      setActiveToolId(null);
    } else if (toolId === 'video_tools') {
      setActiveTab('video_tools');
      setActiveToolId(null);
    } else if (toolId === 'audio_tools') {
      setActiveTab('audio_tools');
      setActiveToolId(null);
    } else {
      setActiveTab('ai_tools');
      setActiveToolId(toolId);
    }
  };

  const activeToolMeta = TOOLS.find(t => t.id === activeToolId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      {/* Header */}
      <Header
        savedCount={savedItems.length}
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          setActiveToolId(null);
          setActivePresetInputs(undefined);
        }}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        activeToolTitle={activeToolId ? activeToolMeta?.title : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'ai_tools' && (
          <>
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
              <ToolGrid onSelectTool={handleSelectTool} />
            )}
          </>
        )}

        {activeTab === 'media_tools' && <MediaTools />}
        {activeTab === 'video_tools' && <VideoTools />}
        {activeTab === 'audio_tools' && <AudioTools />}
        {activeTab === 'ai_assistant' && <AIAssistant />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <span className="font-extrabold text-amber-400">MODERN MEDIA</span> • Golden AI Content & Media Suite • Powered by Gemini 3.6 Flash Server Engine
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
};

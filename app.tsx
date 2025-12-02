import React, { useState } from 'react';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import InfoPanel from './components/InfoPanel';
import ChatInterface from './components/ChatInterface';
import { SystemComponent } from './types';

const App: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<SystemComponent | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 w-8 h-8 rounded flex items-center justify-center font-bold text-white">N</div>
          <h1 className="text-lg font-bold tracking-wide">NVIDIA DGX H100 <span className="font-normal text-slate-400">| System Architecture</span></h1>
        </div>
        <div className="flex gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          <div>v1.0.0</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Diagram Visualization */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700 text-xs text-slate-300">
             <p>Interactive Topology Map</p>
             <p className="text-slate-500">Scroll to zoom • Drag to pan (planned)</p>
          </div>
          <ArchitectureDiagram 
            onSelectComponent={setSelectedComponent}
            selectedComponentId={selectedComponent?.id || null}
          />
        </div>

        {/* Right: Info Panel */}
        <div className="w-96 flex-shrink-0 z-20 shadow-xl">
          <InfoPanel selectedComponent={selectedComponent} />
        </div>
      </main>

      {/* Floating Chat */}
      <ChatInterface />
    </div>
  );
};

export default App;


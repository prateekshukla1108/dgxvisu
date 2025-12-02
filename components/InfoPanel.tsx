
import React from 'react';
import { SystemComponent, ComponentType } from '../types';

interface InfoPanelProps {
  selectedComponent: SystemComponent | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedComponent }) => {
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center border-l border-slate-800 bg-slate-900/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <p className="text-lg font-medium">System Explorer</p>
        <p className="text-sm mt-2 text-slate-400">Select a component to view architectural details, connectivity, and specifications.</p>
      </div>
    );
  }

  const getIcon = (type: ComponentType) => {
      switch(type) {
          case ComponentType.GPU: return "⚡";
          case ComponentType.CPU: return "🧠";
          case ComponentType.NVSWITCH: return "🔀";
          case ComponentType.COMPUTE_NIC: return "🚀";
          case ComponentType.STORAGE_NIC: return "💾";
          case ComponentType.PCIE_SWITCH: return "⑂";
          default: return "📦";
      }
  };

  const getLabel = (type: ComponentType) => {
      return type.replace('_', ' ');
  };

  return (
    <div className="h-full flex flex-col p-6 border-l border-slate-800 bg-slate-900 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg border border-slate-700"
            style={{ backgroundColor: selectedComponent.color + '22', color: selectedComponent.color }} 
        >
            {getIcon(selectedComponent.type)}
        </div>
        <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedComponent.label}</h2>
            <span className="text-xs font-mono uppercase text-slate-400 border border-slate-700 px-2 py-0.5 rounded bg-slate-800">
                {getLabel(selectedComponent.type)}
            </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            {selectedComponent.description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technical Specs</h3>
          <ul className="grid grid-cols-1 gap-2">
            {selectedComponent.specs.map((spec, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded border border-slate-700/30">
                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px]" style={{ backgroundColor: selectedComponent.color, boxShadow: `0 0 5px ${selectedComponent.color}` }}></div>
                {spec}
              </li>
            ))}
          </ul>
        </div>

        <div>
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Topology</h3>
           <div className="flex flex-wrap gap-2">
               {selectedComponent.connectedTo.length > 0 ? (
                   selectedComponent.connectedTo.map(conn => (
                       <span key={conn} className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 hover:text-white hover:border-slate-600 transition-colors cursor-default">
                           ↔ {conn.replace('-', ' ').toUpperCase()}
                       </span>
                   ))
               ) : (
                   <span className="text-xs text-slate-500 italic">Endpoint / Leaf Node</span>
               )}
           </div>
        </div>

        {/* Dynamic Contextual Metrics based on type */}
        {selectedComponent.type === ComponentType.GPU && (
            <div className="mt-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Telemetry (Sim)</h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                            <span>HBM3 Usage</span>
                            <span>64GB / 80GB</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1">
                            <div className="bg-emerald-500 h-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                            <span>Power Draw</span>
                            <span>612W</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1">
                            <div className="bg-orange-500 h-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]" style={{ width: '87%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {selectedComponent.type === ComponentType.COMPUTE_NIC && (
            <div className="mt-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Network Status</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                         <span className="text-xs text-slate-400">Link Status</span>
                         <span className="text-xs text-emerald-400 font-mono">UP (400Gb/s)</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                         <span className="text-xs text-slate-400">RDMA Activity</span>
                         <span className="text-xs text-blue-400 font-mono">HIGH</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;


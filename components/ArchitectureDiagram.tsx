
import React, { useMemo } from 'react';
import { SYSTEM_NODES, DIAGRAM_WIDTH, DIAGRAM_HEIGHT, COLORS } from '../constants';
import { SystemComponent, ComponentType } from '../types';

interface ArchitectureDiagramProps {
  onSelectComponent: (component: SystemComponent) => void;
  selectedComponentId: string | null;
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ onSelectComponent, selectedComponentId }) => {
  
  const connections = useMemo(() => {
    const paths: React.JSX.Element[] = [];
    
    SYSTEM_NODES.forEach(node => {
      node.connectedTo.forEach(targetId => {
        const target = SYSTEM_NODES.find(n => n.id === targetId);
        if (target) {
            const startX = node.x + node.width / 2;
            const startY = node.y + node.height / 2;
            const endX = target.x + target.width / 2;
            const endY = target.y + target.height / 2;

            const isSelected = selectedComponentId === node.id || selectedComponentId === target.id;
            
            // Connection Style Logic
            let strokeColor = isSelected ? COLORS.LINE_ACTIVE : COLORS.LINE_DEFAULT;
            let strokeWidth = isSelected ? 3 : 1;
            let opacity = isSelected ? 1 : 0.3;

            // Highlight GPUDirect Paths (GPU <-> Switch <-> NIC)
            const isGPUDirectPath = 
                (node.type === ComponentType.PCIE_SWITCH && target.type === ComponentType.COMPUTE_NIC) ||
                (node.type === ComponentType.PCIE_SWITCH && target.type === ComponentType.GPU);

            if (isGPUDirectPath && !isSelected) {
                strokeColor = '#64748b'; // Slightly brighter default for data path
                opacity = 0.5;
            }

            // Path Generation
            let d = '';
            
            // Vertical simple curve
            const c1x = startX;
            const c1y = (startY + endY) / 2;
            const c2x = endX;
            const c2y = (startY + endY) / 2;
            d = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

            paths.push(
              <path
                key={`${node.id}-${target.id}`}
                d={d}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={opacity}
                className="transition-all duration-300"
              />
            );
        }
      });
    });
    return paths;
  }, [selectedComponentId]);

  return (
    <div className="w-full h-full overflow-auto bg-slate-950 relative custom-grid">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ 
                 backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
             }}
        ></div>

      <svg 
        viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`} 
        className="w-full h-full min-w-[800px] min-h-[600px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" style={{stroke:COLORS.NVSWITCH, strokeWidth:1, opacity: 0.2}} />
          </pattern>
        </defs>

        {/* --- Background Zones for Logical Grouping --- */}
        {/* GPU Tray Area */}
        <rect x="50" y="600" width="1300" height="380" rx="20" fill="#0f172a" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
        <text x="80" y="630" fill="#475569" fontSize="14" fontWeight="bold">GPU BASEBOARD & NVSWITCH</text>

        {/* Network Area - Logical */}
        <rect x="50" y="440" width="1300" height="150" rx="20" fill="#0f172a" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
        <text x="80" y="470" fill="#475569" fontSize="14" fontWeight="bold">COMPUTE FABRIC (PCIE ATTACHED)</text>


        {/* Connections Layer */}
        <g>{connections}</g>

        {/* Nodes Layer */}
        {SYSTEM_NODES.map((node) => {
          const isSelected = selectedComponentId === node.id;
          
          if (node.type === ComponentType.NVSWITCH) {
              // Special Render for NVSwitch Fabric to look like 4 chips on a board
              return (
                  <g 
                    key={node.id}
                    onClick={() => onSelectComponent(node)}
                    className="cursor-pointer"
                  >
                      {/* Background Bar */}
                      <rect
                        x={node.x} y={node.y} width={node.width} height={node.height}
                        rx={8} fill="#1e1b4b" stroke={node.color} strokeWidth={isSelected ? 2 : 1}
                      />
                      {/* 4 Chips Representation */}
                      {[0, 1, 2, 3].map(i => (
                          <rect 
                            key={i}
                            x={node.x + 100 + (i * 280)} 
                            y={node.y + 15} 
                            width={160} height={50} 
                            rx={4} 
                            fill={node.color} 
                            fillOpacity={0.4}
                            stroke={node.color}
                          />
                      ))}
                      <text x={node.x + node.width/2} y={node.y + node.height/2} textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
                          {node.label}
                      </text>
                  </g>
              )
          }

          return (
            <g 
              key={node.id} 
              onClick={() => onSelectComponent(node)}
              className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              style={{ transformOrigin: `${node.x + node.width/2}px ${node.y + node.height/2}px` }}
            >
              {/* Node Body */}
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={6}
                fill="#1e293b"
                stroke={node.color}
                strokeWidth={isSelected ? 3 : 1}
                fillOpacity={0.9}
                filter={isSelected ? "url(#glow)" : ""}
                className="transition-all duration-300"
              />
              
              {/* Node Label */}
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e2e8f0"
                fontSize="12"
                fontWeight="600"
                className="pointer-events-none select-none"
              >
                {node.label}
              </text>
              
              {/* Decorative Tech Lines */}
              <line x1={node.x + 10} y1={node.y + node.height - 10} x2={node.x + 30} y2={node.y + node.height - 10} stroke={node.color} opacity="0.5" />

            </g>
          );
        })}
        
        {/* Legend */}
        <g transform="translate(20, 20)">
            <rect width="200" height="180" rx="4" fill="#0f172a" stroke="#334155" fillOpacity="0.95" />
            <text x="15" y="25" fill="#94a3b8" fontSize="12" fontWeight="bold">SYSTEM ARCHITECTURE</text>
            
            <circle cx="25" cy="50" r="5" fill={COLORS.CPU} />
            <text x="45" y="54" fill="#cbd5e1" fontSize="11">Xeon CPU Complex</text>
            
            <circle cx="25" cy="70" r="5" fill={COLORS.PCIE_SWITCH} />
            <text x="45" y="74" fill="#cbd5e1" fontSize="11">PCIe Gen5 Switch</text>
            
            <circle cx="25" cy="90" r="5" fill={COLORS.COMPUTE_NIC} />
            <text x="45" y="94" fill="#cbd5e1" fontSize="11">Compute NIC (CX7)</text>

            <circle cx="25" cy="110" r="5" fill={COLORS.STORAGE_NIC} />
            <text x="45" y="114" fill="#cbd5e1" fontSize="11">Storage NIC (CX7)</text>
            
            <circle cx="25" cy="130" r="5" fill={COLORS.GPU} />
            <text x="45" y="134" fill="#cbd5e1" fontSize="11">H100 GPU</text>
            
            <circle cx="25" cy="150" r="5" fill={COLORS.NVSWITCH} />
            <text x="45" y="154" fill="#cbd5e1" fontSize="11">NVSwitch Fabric</text>
        </g>
      </svg>
    </div>
  );
};

export default ArchitectureDiagram;


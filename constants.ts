
import { ComponentType, SystemComponent } from './types';

// Dimensions for the SVG canvas
export const DIAGRAM_WIDTH = 1400;
export const DIAGRAM_HEIGHT = 1000;

// Color Palette
export const COLORS = {
  [ComponentType.CPU]: '#3b82f6', // Blue
  [ComponentType.GPU]: '#84cc16', // Green (NVIDIA)
  [ComponentType.NVSWITCH]: '#a855f7', // Purple
  [ComponentType.COMPUTE_NIC]: '#f59e0b', // Orange
  [ComponentType.STORAGE_NIC]: '#ea580c', // Darker Orange / Rust
  [ComponentType.PCIE_SWITCH]: '#94a3b8', // Slate/Grey
  [ComponentType.NVME]: '#10b981', // Emerald
  BG: '#1e293b',
  LINE_DEFAULT: '#475569',
  LINE_ACTIVE: '#38bdf8'
};

// Layout Levels
const LEVEL_1_CPU = 100;
const LEVEL_2_PCIE = 320;
const LEVEL_3_NIC = 500;
const LEVEL_4_GPU = 700;
const LEVEL_5_NVSWITCH = 900;

// Nodes Definition
export const SYSTEM_NODES: SystemComponent[] = [
  // --- CPUs ---
  {
    id: 'cpu-0',
    type: ComponentType.CPU,
    label: 'CPU 0',
    description: 'Intel Xeon Platinum 8480C (Sapphire Rapids). Root complex for left system half.',
    specs: ['56 Cores', 'PCIe Gen5 Root'],
    x: 480,
    y: LEVEL_1_CPU,
    width: 140,
    height: 100,
    connectedTo: ['pcie-sw-0', 'pcie-sw-1', 'nic-store-0', 'nvme-0', 'cpu-1'],
    color: COLORS[ComponentType.CPU]
  },
  {
    id: 'cpu-1',
    type: ComponentType.CPU,
    label: 'CPU 1',
    description: 'Intel Xeon Platinum 8480C (Sapphire Rapids). Root complex for right system half.',
    specs: ['56 Cores', 'PCIe Gen5 Root'],
    x: 780,
    y: LEVEL_1_CPU,
    width: 140,
    height: 100,
    connectedTo: ['pcie-sw-2', 'pcie-sw-3', 'nic-store-1', 'nvme-1'],
    color: COLORS[ComponentType.CPU]
  },

  // --- Storage/Mgmt NICs (Connected to CPU) ---
  {
    id: 'nic-store-0',
    type: ComponentType.STORAGE_NIC,
    label: 'Storage NIC 0',
    description: 'ConnectX-7 VPI for Storage and In-Band Management. Directly attached to CPU 0.',
    specs: ['OSFP Port', '400Gb/s', 'NFS/Storage Traffic'],
    x: 280,
    y: LEVEL_1_CPU + 10,
    width: 120,
    height: 80,
    connectedTo: [],
    color: COLORS[ComponentType.STORAGE_NIC]
  },
  {
    id: 'nic-store-1',
    type: ComponentType.STORAGE_NIC,
    label: 'Storage NIC 1',
    description: 'ConnectX-7 VPI for Storage and In-Band Management. Directly attached to CPU 1.',
    specs: ['OSFP Port', '400Gb/s', 'NFS/Storage Traffic'],
    x: 1000,
    y: LEVEL_1_CPU + 10,
    width: 120,
    height: 80,
    connectedTo: [],
    color: COLORS[ComponentType.STORAGE_NIC]
  },

  // --- PCIe Switches (The Hubs) ---
  {
    id: 'pcie-sw-0',
    type: ComponentType.PCIE_SWITCH,
    label: 'PCIe Switch 0',
    description: 'Switch Complex 0. Routes traffic between CPU0, GPUs 0-1, and NICs 0-1.',
    specs: ['PCIe Gen5 x16 Lanes', 'Supports GPUDirect'],
    x: 150,
    y: LEVEL_2_PCIE,
    width: 240,
    height: 60,
    connectedTo: ['gpu-0', 'gpu-1', 'nic-0', 'nic-1'],
    color: COLORS[ComponentType.PCIE_SWITCH]
  },
  {
    id: 'pcie-sw-1',
    type: ComponentType.PCIE_SWITCH,
    label: 'PCIe Switch 1',
    description: 'Switch Complex 1. Routes traffic between CPU0, GPUs 2-3, and NICs 2-3.',
    specs: ['PCIe Gen5 x16 Lanes', 'Supports GPUDirect'],
    x: 450,
    y: LEVEL_2_PCIE,
    width: 240,
    height: 60,
    connectedTo: ['gpu-2', 'gpu-3', 'nic-2', 'nic-3'],
    color: COLORS[ComponentType.PCIE_SWITCH]
  },
  {
    id: 'pcie-sw-2',
    type: ComponentType.PCIE_SWITCH,
    label: 'PCIe Switch 2',
    description: 'Switch Complex 2. Routes traffic between CPU1, GPUs 4-5, and NICs 4-5.',
    specs: ['PCIe Gen5 x16 Lanes', 'Supports GPUDirect'],
    x: 750,
    y: LEVEL_2_PCIE,
    width: 240,
    height: 60,
    connectedTo: ['gpu-4', 'gpu-5', 'nic-4', 'nic-5'],
    color: COLORS[ComponentType.PCIE_SWITCH]
  },
  {
    id: 'pcie-sw-3',
    type: ComponentType.PCIE_SWITCH,
    label: 'PCIe Switch 3',
    description: 'Switch Complex 3. Routes traffic between CPU1, GPUs 6-7, and NICs 6-7.',
    specs: ['PCIe Gen5 x16 Lanes', 'Supports GPUDirect'],
    x: 1050,
    y: LEVEL_2_PCIE,
    width: 240,
    height: 60,
    connectedTo: ['gpu-6', 'gpu-7', 'nic-6', 'nic-7'],
    color: COLORS[ComponentType.PCIE_SWITCH]
  },

  // --- Compute NICs (ConnectX-7) ---
  // These connect to PCIe switches, positioned below them
  ...Array.from({ length: 8 }).map((_, i) => {
    // Determine parent switch for positioning logic
    const swIndex = Math.floor(i / 2);
    const swX = 150 + (swIndex * 300); // 150, 450, 750, 1050
    // Offset within switch group (left or right)
    const offsetX = (i % 2) === 0 ? 30 : 150; 
    
    return {
      id: `nic-${i}`,
      type: ComponentType.COMPUTE_NIC,
      label: `CX-7 ${i}`,
      description: `ConnectX-7 VPI Adapter ${i}. Provides 400Gb/s NDR InfiniBand/Ethernet. Supports GPUDirect RDMA by sharing PCIe Switch with GPUs.`,
      specs: ['NDR 400Gb/s', 'OSFP', 'GPUDirect'],
      x: swX + offsetX - 20, // Adjust relative to switch
      y: LEVEL_3_NIC,
      width: 100,
      height: 80,
      connectedTo: [], // Connections defined in Switch
      color: COLORS[ComponentType.COMPUTE_NIC]
    };
  }),

  // --- GPUs ---
  ...Array.from({ length: 8 }).map((_, i) => {
    const swIndex = Math.floor(i / 2);
    const swX = 150 + (swIndex * 300);
    const offsetX = (i % 2) === 0 ? 10 : 130; 
    
    return {
      id: `gpu-${i}`,
      type: ComponentType.GPU,
      label: `H100 ${i}`,
      description: 'NVIDIA H100 Tensor Core GPU. Connected via PCIe Gen5 to Switch (for Host/NIC access) and NVLink to Fabric (for GPU-GPU).',
      specs: ['80GB HBM3', 'Transformer Engine', 'NVLink Gen4'],
      x: swX + offsetX, 
      y: LEVEL_4_GPU,
      width: 100,
      height: 100,
      connectedTo: ['nvswitch-fabric'],
      color: COLORS[ComponentType.GPU]
    };
  }),

  // --- NVSwitch Fabric ---
  {
    id: 'nvswitch-fabric',
    type: ComponentType.NVSWITCH,
    label: 'NVSwitch Gen3 Fabric (4x Chips)',
    description: 'High-bandwidth NVLink Network. 4x NVSwitch chips provide full all-to-all connectivity between GPUs at 900 GB/s.',
    specs: ['3.6 TB/s Bisection BW', 'SHARP Support', '4x Physical Chips'],
    x: 100,
    y: LEVEL_5_NVSWITCH,
    width: 1200,
    height: 80,
    connectedTo: [],
    color: COLORS[ComponentType.NVSWITCH]
  }
];


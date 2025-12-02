
export enum ComponentType {
  CPU = 'CPU',
  GPU = 'GPU',
  NVSWITCH = 'NVSWITCH',
  COMPUTE_NIC = 'COMPUTE_NIC', // ConnectX-7 for Compute Fabric
  STORAGE_NIC = 'STORAGE_NIC', // ConnectX-7 for Storage/Mgmt
  PCIE_SWITCH = 'PCIE_SWITCH',
  NVME = 'NVME'
}

export interface SystemComponent {
  id: string;
  type: ComponentType;
  label: string;
  description: string;
  specs: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  connectedTo: string[]; // IDs of connected components
  color: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DiagramDimensions {
  width: number;
  height: number;
}


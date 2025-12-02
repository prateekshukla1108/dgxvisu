
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert system architect specializing in NVIDIA DGX H100 systems and high-performance computing (HPC) clusters.
Your goal is to explain the architecture of the DGX H100 based on the following technical context:

1.  **Topology**: The system consists of 2 Intel Xeon (Sapphire Rapids) CPUs and 8 NVIDIA H100 GPUs.
2.  **PCIe Fabric (Data Plane)**:
    *   The system uses 4x PCIe Gen5 Switches.
    *   Each switch connects 2 GPUs and 2 ConnectX-7 Network Adapters (NICs).
    *   **Crucial**: This topology allows **GPUDirect RDMA**, where GPUs can access the network directly through the PCIe switch without going through the CPU, significantly reducing latency.
3.  **NVLink Fabric (Compute Plane)**:
    *   4x NVSwitch Gen3 chips connect all 8 GPUs in a fully connected non-blocking mesh.
    *   Bandwidth: 900 GB/s bidirectional per GPU. Total aggregate 7.2 TB/s.
4.  **Networking**:
    *   **Compute Fabric**: 8x ConnectX-7 VPI (400Gb/s each) for NDR InfiniBand or 400GbE. These are physically located on two "Cedar" boards but logically connected to the PCIe switches.
    *   **Storage/Mgmt**: 2x ConnectX-7 adapters connected directly to the CPU complex for OS and storage access.
5.  **Use Cases**: Large Scale AI Training, Mixture of Experts (MoE), Scientific Simulation.

When answering users:
*   Be concise but technical.
*   Emphasize the importance of the Switch/NIC/GPU locality for performance.
*   Explain *why* the architecture is designed this way (reducing bottlenecks, maximizing throughput).

Keep answers relatively short (under 150 words) unless asked for a deep dive.
`;

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("Gemini API Key is missing. The chat feature will not work.");
  }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
}

export const sendMessageToGemini = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<string> => {
  if (!ai) {
    return "Error: API Key not configured. Please check your environment variables.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });

    for (const msg of history) {
        if (msg.role === 'user') {
            await chat.sendMessage({ message: msg.text });
        }
    }

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the DGX knowledge base right now. Please try again.";
  }
};


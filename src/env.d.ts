// /src/env.d.ts
declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      // add more fields if needed
    };
  }
}

export {};

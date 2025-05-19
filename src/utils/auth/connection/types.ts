
export type ConnectionStatus = {
  connectionError: boolean;
  retryCount: number;
};

export const MAX_RETRIES = 3;

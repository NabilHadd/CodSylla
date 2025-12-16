import { useCallback } from "react";

export const useApi = () => {

  // Obtener endpoints
  //const getBaseUrl = useCallback(() => 'https://bg6nj47p-3001.brs.devtunnels.ms', []);
  //const getBaseUrl = useCallback(() => 'https://sb51xcj9-3001.brs.devtunnels.ms', []);
  const getBaseUrl = useCallback(() => 'http://localhost:3001', []);

  return { getBaseUrl };
};
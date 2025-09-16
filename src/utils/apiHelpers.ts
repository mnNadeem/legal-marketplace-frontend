export function extractList<T>(responseData: any): T[] {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData as T[];
  if (Array.isArray(responseData.data)) return responseData.data as T[];
  if (Array.isArray(responseData.items)) return responseData.items as T[];
  if (Array.isArray(responseData.results)) return responseData.results as T[];
  if (Array.isArray(responseData.cases)) return responseData.cases as T[];
  if (Array.isArray(responseData.quotes)) return responseData.quotes as T[];
  return [];
}

export function extractTotal(responseData: any, fallbackList?: any[]): number {
  if (!responseData) return fallbackList?.length || 0;
  if (typeof responseData.total === 'number') return responseData.total;
  if (typeof responseData.count === 'number') return responseData.count;
  if (responseData.pagination && typeof responseData.pagination.total === 'number') {
    return responseData.pagination.total;
  }
  return Array.isArray(fallbackList) ? fallbackList.length : 0;
}
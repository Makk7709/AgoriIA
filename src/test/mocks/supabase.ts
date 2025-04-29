export const mockSupabaseClient = {
  clearMockData: () => {
    // Implementation
  },
  setMockData: (table: string, data: any[]) => {
    // Implementation
  },
  from: (table: string) => ({
    select: () => ({
      then: () => Promise.resolve({ data: [] })
    })
  })
} 
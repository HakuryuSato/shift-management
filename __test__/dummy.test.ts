describe('Dummy Test', () => {
  it('should return 500 status as a dummy test', async () => {
    const response = {
      status: 500,
      json: async () => ({ error: 'Error' }),
    };

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({ error: 'Error' });
  });
});

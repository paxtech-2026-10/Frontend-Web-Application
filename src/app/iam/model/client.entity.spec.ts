import { Client } from './client.entity';

describe('Client (IAM)', () => {
  it('should initialize numeric and string fields with defaults', () => {
    const client = new Client();

    expect(client.id).toBe(0);
    expect(client.firstName).toBe('');
    expect(client.lastName).toBe('');
    expect(client.userId).toBe(0);
  });

  it('should allow updating personal data', () => {
    const client = new Client();

    client.id = 1;
    client.firstName = 'Gael';
    client.lastName = 'Ramirez';
    client.userId = 7;

    expect(client.firstName).toBe('Gael');
    expect(client.lastName).toBe('Ramirez');
    expect(client.userId).toBe(7);
  });
});

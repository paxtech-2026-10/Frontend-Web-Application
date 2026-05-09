import { Provider } from './provider.entity';

describe('Provider (IAM)', () => {
  it('should initialize default values', () => {
    const provider = new Provider();

    expect(provider.id).toBe(0);
    expect(provider.companyName).toBe('');
    expect(provider.userId).toBe(0);
  });

  it('should allow updating company information', () => {
    const provider = new Provider();

    provider.id = 5;
    provider.companyName = 'Pax Salon';
    provider.userId = 9;

    expect(provider.id).toBe(5);
    expect(provider.companyName).toBe('Pax Salon');
    expect(provider.userId).toBe(9);
  });

  it('should keep multiple providers isolated', () => {
    const a = new Provider();
    const b = new Provider();

    a.companyName = 'A';
    b.companyName = 'B';

    expect(a.companyName).not.toEqual(b.companyName);
  });
});

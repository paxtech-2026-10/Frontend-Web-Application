import { AccountEntity } from './account.entity';

describe('AccountEntity', () => {
  it('should create an instance with default values', () => {
    const account = new AccountEntity();

    expect(account).toBeTruthy();
    expect(account.id).toBe(0);
    expect(account.email).toBe('');
    expect(account.passwordHash).toBe('');
    expect(account.type).toBe('');
    expect(account.isActive).toBeFalse();
  });

  it('should allow assigning fields after construction', () => {
    const account = new AccountEntity();

    account.id = 42;
    account.email = 'gael@paxtech.com';
    account.passwordHash = 'hashed';
    account.type = 'client';
    account.isActive = true;

    expect(account.id).toBe(42);
    expect(account.email).toBe('gael@paxtech.com');
    expect(account.passwordHash).toBe('hashed');
    expect(account.type).toBe('client');
    expect(account.isActive).toBeTrue();
  });

  it('should keep instances independent', () => {
    const a = new AccountEntity();
    const b = new AccountEntity();

    a.email = 'a@paxtech.com';
    b.email = 'b@paxtech.com';

    expect(a.email).not.toEqual(b.email);
  });
});

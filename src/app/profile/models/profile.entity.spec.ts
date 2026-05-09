import { Profile } from './profile.entity';

describe('Profile', () => {
  it('should create an instance with default values', () => {
    const profile = new Profile();

    expect(profile).toBeTruthy();
    expect(profile.accountId).toBe('0');
    expect(profile.name).toBe('');
    expect(profile.email).toBe('');
    expect(profile.phoneNumber).toBe('');
    expect(profile.identityDocument).toBe('');
    expect(profile.notifications).toBeFalse();
    expect(profile.location).toBeFalse();
  });

  it('should keep accountId as string type', () => {
    const profile = new Profile();

    expect(typeof profile.accountId).toBe('string');
  });

  it('should allow updating contact and toggle fields', () => {
    const profile = new Profile();

    profile.name = 'Gael Ramirez';
    profile.email = 'gael@paxtech.com';
    profile.phoneNumber = '+51999999999';
    profile.identityDocument = '12345678';
    profile.notifications = true;
    profile.location = true;

    expect(profile.name).toBe('Gael Ramirez');
    expect(profile.email).toBe('gael@paxtech.com');
    expect(profile.phoneNumber).toBe('+51999999999');
    expect(profile.identityDocument).toBe('12345678');
    expect(profile.notifications).toBeTrue();
    expect(profile.location).toBeTrue();
  });
});

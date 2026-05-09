import { SalonProfile } from './salon-profile.entity';

describe('SalonProfile', () => {
  it('should create instance with defaults when no response is provided', () => {
    const profile = new SalonProfile();

    expect(profile).toBeTruthy();
    expect(profile.id).toBe(0);
    expect(profile.providerId).toBe(0);
    expect(profile.companyName).toBe('');
    expect(profile.location).toBe('');
    expect(profile.email).toBe('');
    expect(profile.profileImageUrl).toBe('');
    expect(profile.coverImageUrl).toBe('');
    expect(profile.socials).toEqual({});
    expect(profile.portfolioImages).toEqual([]);
  });

  it('should hydrate from a partial response', () => {
    const profile = new SalonProfile({
      id: 7,
      providerId: 12,
      companyName: 'Pax Salon',
      location: 'Lima, Peru',
      profileImageUrl: 'https://cdn/p.png',
      portfolioImages: ['a.png', 'b.png'],
      socials: { instagram: 'https://ig/pax' },
    });

    expect(profile.id).toBe(7);
    expect(profile.providerId).toBe(12);
    expect(profile.companyName).toBe('Pax Salon');
    expect(profile.location).toBe('Lima, Peru');
    expect(profile.profileImageUrl).toBe('https://cdn/p.png');
    expect(profile.portfolioImages.length).toBe(2);
    expect(profile.socials['instagram']).toBe('https://ig/pax');
  });

  it('should fall back to defaults for missing fields in partial response', () => {
    const profile = new SalonProfile({ companyName: 'Only Name' });

    expect(profile.companyName).toBe('Only Name');
    expect(profile.location).toBe('');
    expect(profile.email).toBe('');
    expect(profile.portfolioImages).toEqual([]);
    expect(profile.socials).toEqual({});
  });
});

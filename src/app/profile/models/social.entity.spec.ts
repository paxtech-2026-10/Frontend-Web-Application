import { CreateSocialDto, SocialSummary } from './social.entity';

describe('Social DTOs', () => {
  it('should accept a SocialSummary shape returned by the API', () => {
    const summary: SocialSummary = {
      id: 1,
      socialIcon: 'instagram',
      socialUrl: 'https://instagram.com/pax',
    };

    expect(summary.id).toBe(1);
    expect(summary.socialIcon).toBe('instagram');
    expect(summary.socialUrl).toBe('https://instagram.com/pax');
  });

  it('should accept a CreateSocialDto shape used for POST/PUT', () => {
    const payload: CreateSocialDto = {
      socialIcon: 'tiktok',
      socialUrl: 'https://tiktok.com/@pax',
    };

    expect(payload.socialIcon).toBe('tiktok');
    expect(payload.socialUrl).toBe('https://tiktok.com/@pax');
  });
});

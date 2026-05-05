export class SalonProfile {
  id: number;
  providerId: number;
  companyName: string;
  location: string;
  email: string;
  profileImageUrl: string;
  coverImageUrl: string;
  socials: Record<string, string>;
  portfolioImages: string[];

  constructor(response?: Partial<SalonProfile>) {
    this.id = response?.id ?? 0;
    this.providerId = response?.providerId ?? 0;
    this.companyName = response?.companyName ?? '';
    this.location = response?.location ?? '';
    this.email = response?.email ?? '';
    this.profileImageUrl = response?.profileImageUrl ?? '';
    this.coverImageUrl = response?.coverImageUrl ?? '';
    this.socials = response?.socials ?? {};
    this.portfolioImages = response?.portfolioImages ?? [];
  }
}

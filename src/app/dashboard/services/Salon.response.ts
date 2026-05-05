// Salon.response.ts
export interface ProviderProfileResource {
  id: number
  providerId: number;
  companyName: string;
  location: string;
  email: number;
  profileImageUrl: string;// Changed from number to string since your API returns strings
  coverImageUrl: string;
  socials: [];
  portfolioImages:[]
}

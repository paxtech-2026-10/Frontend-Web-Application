export class ProviderProfile {
  id: number
  providerId: number;
  companyName: string;
  location: string;
  email: number;
  profileImageURL: string;// Changed from number to string since your API returns strings
  coverImageURL: string;
  socials: [];
  portfolioImages:[]
  constructor() {
    this.id = 0;
    this.providerId = 0;
    this.companyName = '';
    this.location = '';
    this.email = 0;
    this.profileImageURL = '';
    this.coverImageURL = '';
    this.socials = [];
    this.portfolioImages = [];
  }
}

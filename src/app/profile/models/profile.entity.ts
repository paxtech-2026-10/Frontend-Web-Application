// Corrige el modelo Profile
export class Profile {
  accountId: string;
  name: string;
  email: string;
  phoneNumber: string;
  identityDocument: string;
  notifications: boolean;
  location: boolean;
  profileImageUrl: string;

  constructor() {
    this.accountId = '0'; // Debe ser string, no number
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.identityDocument = '';
    this.notifications = false;
    this.location = false;
    this.profileImageUrl = '';
  }
}

// profile.models.ts – coloca junto a salon-profile.entity.ts
export interface UpdateImagesDto {
  profileImageUrl: string;
  coverImageUrl:   string;
}

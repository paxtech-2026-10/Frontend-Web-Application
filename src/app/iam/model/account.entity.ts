export class AccountEntity {
  id: number;
  email: string;
  passwordHash: string;
  type: string;
  isActive: boolean;

  constructor() {
    this.id = 0;
    this.email = '';
    this.passwordHash = '';
    this.type = '';
    this.isActive = false;
  }
}

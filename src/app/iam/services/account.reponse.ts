export interface AccountResponse {
  id: number;
  email: string;
  passwordHash: string;
  type: string;
  isActive: boolean;
}

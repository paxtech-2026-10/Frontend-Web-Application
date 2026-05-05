/* Resumen devuelto por la API */
export interface SocialSummary {
  id: number;
  socialIcon: string;   // 'instagram' | 'tiktok' | ...
  socialUrl:  string;
}

/* Payload que envías en POST o PUT */
export interface CreateSocialDto {
  socialIcon: string;
  socialUrl:  string;
}

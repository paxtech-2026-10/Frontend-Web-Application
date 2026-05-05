import { SalonProfile } from '../models/salon-profile.entity';
import { ProfileSalonResponse } from './profile-salon.response';

export class SalonProfileAssembler {
  static toEntityFromResponse(resource?: ProfileSalonResponse): SalonProfile {
    const urls: string[] = (resource?.portfolioImages ?? []).map(p =>
      typeof p === 'string'          // el backend ya devolvía una URL
        ? p
        : (p as any).imageUrl        // objeto { id, imageUrl }
    );
    return new SalonProfile({
      id: resource?.id ?? 0,
      providerId: resource?.providerId ?? 0,
      companyName: resource?.companyName ?? '',
      location: resource?.location ?? '',
      email: resource?.email ?? '',
      profileImageUrl: resource?.profileImageUrl ?? '',
      coverImageUrl: resource?.coverImageUrl ?? '',
      socials: resource?.socials ?? {},
      portfolioImages: urls
    });
  }

  static toEntitiesFromResponse(resources: ProfileSalonResponse[] = []): SalonProfile[] {
    return resources.map(this.toEntityFromResponse);
  }

  static toResponseFromEntity(entity: SalonProfile): ProfileSalonResponse {
    return {
      id: entity.id ?? 0,
      providerId: entity.providerId ?? 0,
      companyName: entity.companyName ?? '',
      location: entity.location ?? '',
      email: entity.email ?? '',
      profileImageUrl: entity.profileImageUrl ?? '',
      coverImageUrl: entity.coverImageUrl ?? '',
      socials: entity.socials ?? {},
      portfolioImages: entity.portfolioImages ?? []
    };
  }
}

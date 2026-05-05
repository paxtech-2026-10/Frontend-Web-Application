import {ProviderProfileResource} from './Salon.response';
import {ProviderProfile} from '../models/Salon.entity';

export class ProviderProfileAssembler {
  static toEntityFromResource(resource: ProviderProfileResource): ProviderProfile {
    return {
      id: resource.id,
      providerId: resource.providerId,
      companyName: resource.companyName,
      location: resource.location,
      email: resource.email,
      profileImageURL: resource.profileImageUrl,
      coverImageURL: resource.coverImageUrl,
      socials: resource.socials,
      portfolioImages: resource.portfolioImages
    };
  }

  static toEntitiesfromResponse(response: ProviderProfileResource[]): ProviderProfile[] {
    // No need for type assertion - response is now properly typed as an array
    return response.map(salon => this.toEntityFromResource(salon));
  }
}

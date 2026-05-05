import {Service} from '../model/service.entity';
import {ServiceResponse} from './service.response';

export class ServiceAssembler {
  static toEntityFromResource(resource: ServiceResponse): Service {
    return {
      id: resource.id,
      name: resource.name,
      //description: resource.description,
      duration: resource.duration,
      price: resource.price,

      providerId: resource.providerId
    };
  }

  static toEntitiesFromResponse(resources: ServiceResponse[]): Service[] {
    return resources.map(service => ServiceAssembler.toEntityFromResource(service));
  }


  /*static toResponseFromEntity(entity: Service): ServiceResponse {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      duration: entity.duration,
      price: entity.price,
      status: entity.status
    };
  }*/
}

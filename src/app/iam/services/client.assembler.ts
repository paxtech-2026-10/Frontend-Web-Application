import {ClientResponse} from './client.response';
import {Client} from '../model/client.entity';

export class ClientAssembler {
  static toEntityFromResource(resource: ClientResponse): Client {
    return{
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      userId: resource.userId,
    }
  }

  static toEntitiesFromResponse(response: ClientResponse[]): Client[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}

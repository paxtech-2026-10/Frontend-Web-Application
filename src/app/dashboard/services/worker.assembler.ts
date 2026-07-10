import {WorkerResource} from './worker.resource';
import {Worker} from '../models/worker.entity';

export class WorkerAssembler {
  static  toEntityFromResource(resource: WorkerResource): Worker {
    return {
      id: resource.id,
      name: resource.name,
      specialization: resource.specialization,
      photoUrl: resource.photoUrl,
      providerId: resource.providerId,
    }
  }
  static toEntitiesFromResponse(resources: WorkerResource[]): Worker[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}

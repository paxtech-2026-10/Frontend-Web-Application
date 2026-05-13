import { WorkerAssembler } from './worker.assembler';
import { WorkerResource } from './worker.resource';

describe('WorkerAssembler', () => {
  const workerResource: WorkerResource = {
    id: 9,
    name: 'Ana',
    specialization: 'Colorista',
    photoUrl: 'https://example.com/ana.png',
    providerId: 4
  };

  it('should map a WorkerResource to Worker entity', () => {
    const entity = WorkerAssembler.toEntityFromResource(workerResource);

    expect(entity).toEqual(workerResource);
  });

  it('should map a WorkerResource list to Worker entity list', () => {
    const resources: WorkerResource[] = [
      workerResource,
      { ...workerResource, id: 10, name: 'Luis' }
    ];

    const entities = WorkerAssembler.toEntitiesFromResponse(resources);

    expect(entities).toEqual(resources);
  });
});

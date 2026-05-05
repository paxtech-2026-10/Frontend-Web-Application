import { ServiceAssembler } from './service.assembler';
import { ServiceResponse } from './service.response';

describe('ServiceAssembler', () => {

  describe('toEntityFromResource', () => {
    it('maps every field from the response to the entity', () => {
      // Arrange
      const resource: ServiceResponse = {
        id: 42,
        name: 'Haircut',
        duration: 30,
        price: 50,
        providerId: 7
      };

      // Act
      const entity = ServiceAssembler.toEntityFromResource(resource);

      // Assert
      expect(entity.id).toBe(42);
      expect(entity.name).toBe('Haircut');
      expect(entity.duration).toBe(30);
      expect(entity.price).toBe(50);
      expect(entity.providerId).toBe(7);
    });

    it('produces a fresh object that is not the same reference as the input', () => {
      // Arrange
      const resource: ServiceResponse = {
        id: 1, name: 'A', duration: 10, price: 1, providerId: 1
      };

      // Act
      const entity = ServiceAssembler.toEntityFromResource(resource);

      // Assert
      // The mapper must not leak the response object — callers may mutate the entity safely.
      expect(entity).not.toBe(resource as unknown as typeof entity);
    });
  });

  describe('toEntitiesFromResponse', () => {
    it('returns an empty array when the response is empty', () => {
      // Arrange
      const resources: ServiceResponse[] = [];

      // Act
      const entities = ServiceAssembler.toEntitiesFromResponse(resources);

      // Assert
      expect(entities).toEqual([]);
    });

    it('preserves order and maps each element', () => {
      // Arrange
      const resources: ServiceResponse[] = [
        { id: 1, name: 'Haircut', duration: 30, price: 50, providerId: 1 },
        { id: 2, name: 'Manicure', duration: 45, price: 70, providerId: 1 },
        { id: 3, name: 'Pedicure', duration: 60, price: 90, providerId: 2 }
      ];

      // Act
      const entities = ServiceAssembler.toEntitiesFromResponse(resources);

      // Assert
      expect(entities.length).toBe(3);
      expect(entities[0].id).toBe(1);
      expect(entities[1].id).toBe(2);
      expect(entities[2].id).toBe(3);
      expect(entities[2].name).toBe('Pedicure');
      expect(entities[2].providerId).toBe(2);
    });
  });
});

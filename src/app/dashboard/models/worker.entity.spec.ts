import { Worker } from './worker.entity';

describe('Worker', () => {
  it('should initialize with default values', () => {
    const worker = new Worker();

    expect(worker.id).toBe(0);
    expect(worker.name).toBe('');
    expect(worker.specialization).toBe('');
    expect(worker.photoUrl).toBe('');
    expect(worker.providerId).toBe(0);
  });
});

import { offzySeed } from '../../../data/seeds/offzySeed';
import { DemoStoreRepository } from '../repositories/demoStoreRepository';
import { createVersionedDemoStore, type StorageLike } from '../storage/versionedStorage';

export function createDemoRepositories(storage: StorageLike): DemoStoreRepository {
  return new DemoStoreRepository(
    createVersionedDemoStore({
      storage,
      seed: offzySeed,
    }),
  );
}

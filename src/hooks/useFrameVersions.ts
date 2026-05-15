import { useMemo } from 'react';
import { loadFrameVersionCatalog } from '@/services/templates';
import type { FrameVersion, FrameVersionGroup } from '@/types/template';

export interface UseFrameVersionsResult {
  readonly versions: readonly FrameVersion[];
  readonly groups: ReadonlyMap<FrameVersionGroup, readonly FrameVersion[]>;
}

export function useFrameVersions(): UseFrameVersionsResult {
  return useMemo(() => {
    const { versions } = loadFrameVersionCatalog();
    const groups = new Map<FrameVersionGroup, FrameVersion[]>();
    for (const version of versions) {
      const bucket = groups.get(version.group);
      if (bucket) {
        bucket.push(version);
      } else {
        groups.set(version.group, [version]);
      }
    }
    return { versions, groups };
  }, []);
}

import versionMeta from "@/version.json";

// Single source of truth is /version.json, written by `npm run release`.
// package.json is kept in sync by that script; import from here, not from there,
// so the value works identically in server and client components.

export interface VersionMeta {
  /** Semver, e.g. "1.4.2" */
  version: string;
  /** Monotonic counter, incremented on every release */
  build: number;
  /** ISO timestamp of the release */
  releasedAt: string;
  /** Short git SHA at release time, when available */
  commit?: string;
}

const meta = versionMeta as VersionMeta;

export const version = meta.version;
export const build = meta.build;
export const releasedAt = meta.releasedAt;
export const commit = meta.commit;

/** "v1.4.2" — for user-facing UI */
export const displayVersion = `v${meta.version}`;

/** "v1.4.2+27" — version plus build number */
export const fullVersion = `v${meta.version}+${meta.build}`;

/** "v1.4.2+27 (a1b2c3d)" — everything you'd want in a bug report */
export const detailedVersion = meta.commit
  ? `${fullVersion} (${meta.commit})`
  : fullVersion;

export default meta;

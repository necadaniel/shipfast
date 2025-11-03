/**
 * React hook for team encryption
 * Handles fetching and caching wrapped team keys
 */

import { useState, useEffect, useCallback } from "react";
import { unwrapTeamKey, decryptWithTeamKey } from "@/libs/encryption";
import apiClient from "@/libs/api";

interface UseTeamEncryptionReturn {
  wrappedKey: string | null;
  teamKey: string | null;
  loading: boolean;
  error: string | null;
  unwrapKey: (personalKey: string) => Promise<string>;
  decryptValue: (encryptedValue: string) => Promise<string>;
  refresh: () => Promise<void>;
}

// Cache team keys in memory (per session)
const teamKeyCache = new Map<string, string>();

export function useTeamEncryption(
  teamId: string,
  personalKey: string | null
): UseTeamEncryptionReturn {
  const [wrappedKey, setWrappedKey] = useState<string | null>(null);
  const [teamKey, setTeamKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wrapped team key from API
  const fetchWrappedKey = useCallback(async () => {
    if (!teamId) {
      setError("Team ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: any = await apiClient.get(
        `/team/${teamId}/encryption-key`
      );

      // apiClient interceptor returns response.data directly
      if (response.wrappedKey) {
        setWrappedKey(response.wrappedKey);
      } else {
        setError("No wrapped key received from server");
      }
    } catch (err: any) {
      console.error("Error fetching team encryption key:", err);
      setError(
        err.response?.data?.error || "Failed to fetch team encryption key"
      );
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Unwrap the team key using personal key
  const unwrapKeyFn = useCallback(
    async (personalKeyToUse: string): Promise<string> => {
      if (!wrappedKey) {
        throw new Error("Wrapped key not loaded yet");
      }

      // Check cache first
      const cacheKey = `${teamId}_${wrappedKey}`;
      const cached = teamKeyCache.get(cacheKey);
      if (cached) {
        setTeamKey(cached);
        return cached;
      }

      try {
        const unwrapped = await unwrapTeamKey(wrappedKey, personalKeyToUse);
        // Cache the unwrapped key
        teamKeyCache.set(cacheKey, unwrapped);
        setTeamKey(unwrapped);
        return unwrapped;
      } catch (err) {
        console.error("Error unwrapping team key:", err);
        throw new Error("Failed to unwrap team key");
      }
    },
    [wrappedKey, teamId]
  );

  // Decrypt a value using the team key
  const decryptValue = useCallback(
    async (encryptedValue: string): Promise<string> => {
      if (!teamKey) {
        throw new Error("Team key not available. Call unwrapKey first.");
      }

      try {
        return await decryptWithTeamKey(encryptedValue, teamKey);
      } catch (err) {
        console.error("Error decrypting with team key:", err);
        throw new Error("Failed to decrypt value");
      }
    },
    [teamKey]
  );

  // Refresh wrapped key (useful after key rotation)
  const refresh = useCallback(async () => {
    // Clear cache
    teamKeyCache.clear();
    setTeamKey(null);
    await fetchWrappedKey();
  }, [fetchWrappedKey]);

  // Auto-fetch on mount and when teamId changes
  useEffect(() => {
    fetchWrappedKey();
  }, [fetchWrappedKey]);

  // Auto-unwrap if personal key is provided
  useEffect(() => {
    if (wrappedKey && personalKey && !teamKey) {
      unwrapKeyFn(personalKey).catch((err) => {
        console.error("Auto-unwrap failed:", err);
        setError("Failed to automatically unwrap team key");
      });
    }
  }, [wrappedKey, personalKey, teamKey, unwrapKeyFn]);

  return {
    wrappedKey,
    teamKey,
    loading,
    error,
    unwrapKey: unwrapKeyFn,
    decryptValue,
    refresh,
  };
}

// Clear all cached team keys (call on logout)
export function clearTeamKeyCache() {
  teamKeyCache.clear();
}

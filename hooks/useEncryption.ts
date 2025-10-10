"use client";

import { useEffect, useState } from "react";
import {
  getEncryptionKeyFromSession,
  setEncryptionKeyInSession,
  clearEncryptionKey,
} from "@/libs/encryption";
import apiClient from "@/libs/api";

export function useEncryption() {
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEncryptionKey();
  }, []);

  const loadEncryptionKey = async () => {
    try {
      console.log("=== LOAD ENCRYPTION KEY START ===");
      // Check if key exists in session storage
      let key = getEncryptionKeyFromSession();

      if (!key) {
        // Fetch from API
        console.log("Fetching encryption key from API...");
        const response = (await apiClient.get("/encryption/key")) as any;
        console.log("API response received:", !!response);
        console.log("API response:", response);
        console.log("API response type:", typeof response);

        // apiClient interceptor returns response.data directly
        // so response is already the data object: { encryptionKey: "..." }
        if (response?.encryptionKey) {
          key = response.encryptionKey;
          console.log("Encryption key extracted, length:", key.length);
        } else {
          console.error("No encryption key in response:", response);
          throw new Error("No encryption key returned from server");
        }

        // Store in session
        if (key) {
          console.log("Storing encryption key in session");
          setEncryptionKeyInSession(key);
        } else {
          throw new Error("Encryption key is empty");
        }
      } else {
        console.log(
          "Using cached encryption key from session, length:",
          key.length
        );
      }

      console.log("Setting encryption key in state");
      setEncryptionKey(key);
      setError(null);
      console.log("=== LOAD ENCRYPTION KEY SUCCESS ===");
    } catch (err: any) {
      console.error("=== LOAD ENCRYPTION KEY ERROR ===");
      console.error("Failed to load encryption key:", err);
      setError(
        err?.response?.data?.error ||
          err.message ||
          "Failed to load encryption key"
      );
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearEncryptionKey();
    setEncryptionKey(null);
  };

  return {
    encryptionKey,
    isLoading,
    error,
    logout,
  };
}

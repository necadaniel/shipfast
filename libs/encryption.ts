/**
 * Client-side encryption utilities using Web Crypto API
 * AES-256-GCM encryption for zero-knowledge architecture
 */

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

// Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derive a cryptographic key from a password using PBKDF2
 * This ensures the same password always produces the same key
 */
export async function deriveKey(
  password: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate a random encryption key
 * This should be stored securely (e.g., in user's account, encrypted with their password)
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exported);
}

/**
 * Import a key from base64 string
 */
async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyBase64);
  return crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a string value using AES-256-GCM
 * Returns base64 encoded encrypted data with IV prepended
 */
export async function encryptValue(
  value: string,
  encryptionKey: string
): Promise<string> {
  try {
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Import the encryption key
    const key = await importKey(encryptionKey);

    // Encrypt the value
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      stringToArrayBuffer(value)
    );

    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return as base64
    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt value");
  }
}

/**
 * Decrypt a string value using AES-256-GCM
 * Expects base64 encoded encrypted data with IV prepended
 */
export async function decryptValue(
  encryptedValue: string,
  encryptionKey: string
): Promise<string> {
  try {
    // Decode from base64
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedValue));

    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Import the encryption key
    const key = await importKey(encryptionKey);

    // Decrypt the value
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );

    return arrayBufferToString(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt value");
  }
}

/**
 * Encrypt all variables in a project
 */
export async function encryptVariables(
  variables: { key: string; value: string }[],
  encryptionKey: string
): Promise<{ key: string; value: string; encrypted: boolean }[]> {
  const encrypted = await Promise.all(
    variables.map(async (variable) => ({
      key: variable.key,
      value: await encryptValue(variable.value, encryptionKey),
      encrypted: true,
    }))
  );

  return encrypted;
}

/**
 * Decrypt all variables in a project
 */
export async function decryptVariables(
  variables: { key: string; value: string; encrypted?: boolean }[],
  encryptionKey: string
): Promise<{ key: string; value: string }[]> {
  const decrypted = await Promise.all(
    variables.map(async (variable) => ({
      key: variable.key,
      value:
        variable.encrypted !== false
          ? await decryptValue(variable.value, encryptionKey)
          : variable.value,
    }))
  );

  return decrypted;
}

/**
 * Get or create encryption key for user
 * This should be called once on login and stored in memory/session
 */
export function getEncryptionKeyFromSession(): string | null {
  // Try to get from sessionStorage first (exists only in browser)
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem("envsync_encryption_key");
}

/**
 * Store encryption key in session
 */
export function setEncryptionKeyInSession(key: string): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("envsync_encryption_key", key);
}

/**
 * Clear encryption key from session (on logout)
 */
export function clearEncryptionKey(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("envsync_encryption_key");
}

/**
 * Initialize encryption for a new user
 * Generates a master key and stores it (should be saved to user's account)
 */
export async function initializeEncryption(): Promise<string> {
  const masterKey = await generateEncryptionKey();
  setEncryptionKeyInSession(masterKey);
  return masterKey;
}

// ============================================================================
// TEAM ENCRYPTION FUNCTIONS
// ============================================================================

/**
 * Generate a team master encryption key
 * This key will be wrapped with each member's personal key
 */
export async function generateTeamEncryptionKey(): Promise<string> {
  return generateEncryptionKey();
}

/**
 * Wrap (encrypt) the team key with a user's personal encryption key
 * This allows the user to decrypt the team key using their personal key
 */
export async function wrapTeamKey(
  teamKey: string,
  personalKey: string
): Promise<string> {
  return encryptValue(teamKey, personalKey);
}

/**
 * Unwrap (decrypt) the team key using a user's personal encryption key
 * Returns the team's master key that can be used to decrypt team variables
 */
export async function unwrapTeamKey(
  wrappedKey: string,
  personalKey: string
): Promise<string> {
  return decryptValue(wrappedKey, personalKey);
}

/**
 * Encrypt a value with the team's encryption key
 * Same as encryptValue but semantically named for team context
 */
export async function encryptWithTeamKey(
  value: string,
  teamKey: string
): Promise<string> {
  return encryptValue(value, teamKey);
}

/**
 * Decrypt a value with the team's encryption key
 * Same as decryptValue but semantically named for team context
 */
export async function decryptWithTeamKey(
  encryptedValue: string,
  teamKey: string
): Promise<string> {
  return decryptValue(encryptedValue, teamKey);
}

/**
 * Two-layer decryption: Unwrap team key, then decrypt value
 * This is the main function for team members to access team variables
 */
export async function decryptTeamValue(
  encryptedValue: string,
  wrappedTeamKey: string,
  personalKey: string
): Promise<string> {
  // Step 1: Unwrap team key using personal key
  const teamKey = await unwrapTeamKey(wrappedTeamKey, personalKey);

  // Step 2: Decrypt value using team key
  return decryptWithTeamKey(encryptedValue, teamKey);
}

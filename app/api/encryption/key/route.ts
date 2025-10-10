import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import crypto from "crypto";

// Generate a secure random encryption key
function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("base64");
}

// GET /api/encryption/key - Get or create user's encryption key
// NOTE: encryptionKey is marked as 'private' in the User schema, which means
// it won't be included when the user document is converted to JSON automatically.
// We explicitly extract it here to return it in the response.
export async function GET() {
  try {
    const session = await auth();

    console.log("=== ENCRYPTION KEY REQUEST ===");
    console.log("Session user ID:", session?.user?.id);
    console.log("Session user email:", session?.user?.email);
    console.log("Full session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    let user = await User.findById(session.user.id);

    console.log("MongoDB query for ID:", session.user.id);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      // Try to find by email as fallback
      console.log("Trying to find user by email:", session.user.email);
      user = await User.findOne({ email: session.user.email });
      console.log("User found by email:", user ? "Yes" : "No");

      if (user) {
        console.log("User actual MongoDB ID:", user._id.toString());
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Has encryption key:", user?.encryptionKey ? "Yes" : "No");

    // If user doesn't have an encryption key, generate one
    if (!user.encryptionKey) {
      console.log("Generating new encryption key...");
      user.encryptionKey = generateEncryptionKey();
      await user.save();
      console.log("Encryption key saved to database");
    }

    // Access the encryption key directly (bypassing toJSON which would hide private fields)
    const encryptionKey = user.encryptionKey;

    console.log("Returning encryption key (length):", encryptionKey?.length);
    console.log("=== END ENCRYPTION KEY REQUEST ===");

    return NextResponse.json({
      encryptionKey: encryptionKey,
    });
  } catch (error) {
    console.error("Error fetching encryption key:", error);
    return NextResponse.json(
      { error: "Failed to fetch encryption key" },
      { status: 500 }
    );
  }
}

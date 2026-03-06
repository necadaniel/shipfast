import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          ResendProvider({
            apiKey: process.env.RESEND_API_KEY,
            from: config.resend.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    jwt: async ({ token, user, account, profile }: any) => {
      // On sign in, attach the MongoDB user ID to the token
      if (user) {
        token.id = user.id || user._id;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session?.user) {
        // Use the MongoDB user ID from the token
        session.user.id = token.id || token.sub;
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }: any) => {
      try {
        console.log("=== CREATE USER EVENT FIRED ===");
        console.log("User ID:", user.id);
        console.log("User email:", user.email);

        // Import dependencies
        const crypto = await import("crypto");
        const connectMongoose = (await import("./mongoose")).default;

        // Ensure MongoDB connection is established
        console.log("Connecting to MongoDB...");
        await connectMongoose();
        console.log("MongoDB connected");

        const User = (await import("@/models/User")).default;

        // Generate encryption key immediately on signup
        const encryptionKey = crypto.randomBytes(32).toString("base64");
        console.log("Generated encryption key length:", encryptionKey.length);

        // Use $set to ensure fields are added
        const result = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              hasAccess: false,
              plan: "free", // New users start with free plan
              teamId: null,
              teamRole: null,
              encryptionKey: encryptionKey,
              customerId: null,
              priceId: null,
            },
          },
          { new: true }
        );

        console.log("Update result:", result ? "Success" : "Failed");
        if (result) {
          console.log("User has encryptionKey:", !!result.encryptionKey);
        }
        console.log("=== END CREATE USER EVENT ===");
      } catch (error) {
        console.error("=== CREATE USER EVENT ERROR ===");
        console.error(error);
        console.error("=== END ERROR ===");
      }
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

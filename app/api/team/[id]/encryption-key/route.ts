import { auth } from "@/libs/next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import User from "@/models/User";
import { generateTeamEncryptionKey, wrapTeamKey } from "@/libs/encryption";

/**
 * GET /api/team/[id]/encryption-key
 * Fetch the user's wrapped team encryption key
 * Returns the wrapped key that can be unwrapped with user's personal key
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    await connectMongo();

    // Fetch team with encryption keys
    const team: any = await Team.findById(teamId)
      .select("+teamEncryptionKey") // Include the encrypted field
      .lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user has access (is owner or member)
    const isOwner = team.ownerId.toString() === session.user.id;
    const isMember = team.members.some(
      (m: any) => m.userId.toString() === session.user.id
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "You don't have access to this team" },
        { status: 403 }
      );
    }

    // If team doesn't have an encryption key yet, generate one
    if (!team.teamEncryptionKey) {
      // This is the first time someone is accessing team encryption
      // Generate team master key
      const teamMasterKey = await generateTeamEncryptionKey();

      // Get user's personal encryption key
      const user: any = await User.findById(session.user.id)
        .select("+encryptionKey")
        .lean();

      if (!user?.encryptionKey) {
        return NextResponse.json(
          { error: "User encryption key not found. Please refresh the page." },
          { status: 400 }
        );
      }

      // Wrap team key with user's personal key
      const wrappedKey = await wrapTeamKey(teamMasterKey, user.encryptionKey);

      // Save to database
      await Team.findByIdAndUpdate(teamId, {
        teamEncryptionKey: teamMasterKey,
        $push: {
          wrappedTeamKeys: {
            userId: session.user.id,
            wrappedKey,
            wrappedAt: new Date(),
          },
        },
      });

      return NextResponse.json({
        wrappedKey,
        isNew: true,
      });
    }

    // Find user's wrapped key
    const userWrappedKey = team.wrappedTeamKeys?.find(
      (wk: any) => wk.userId.toString() === session.user.id
    );

    // If user doesn't have a wrapped key yet (e.g., they just joined), create one
    if (!userWrappedKey) {
      // Get user's personal encryption key
      const user: any = await User.findById(session.user.id)
        .select("+encryptionKey")
        .lean();

      if (!user?.encryptionKey) {
        return NextResponse.json(
          { error: "User encryption key not found. Please refresh the page." },
          { status: 400 }
        );
      }

      // Wrap team key with user's personal key
      const wrappedKey = await wrapTeamKey(
        team.teamEncryptionKey,
        user.encryptionKey
      );

      // Save to database
      await Team.findByIdAndUpdate(teamId, {
        $push: {
          wrappedTeamKeys: {
            userId: session.user.id,
            wrappedKey,
            wrappedAt: new Date(),
          },
        },
      });

      return NextResponse.json({
        wrappedKey,
        isNew: true,
      });
    }

    // Return existing wrapped key
    return NextResponse.json({
      wrappedKey: userWrappedKey.wrappedKey,
      isNew: false,
    });
  } catch (error) {
    console.error("Error fetching team encryption key:", error);
    return NextResponse.json(
      { error: "Failed to fetch team encryption key" },
      { status: 500 }
    );
  }
}

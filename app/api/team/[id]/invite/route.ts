import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import crypto from "crypto";
import { Resend } from "resend";
import config from "@/config";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/team/[id]/invite - Send team invitation
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { email, role = "member" } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "member", "viewer"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, member, or viewer" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user can invite (owner or admin)
    if (!team.canInvite(user._id.toString())) {
      return NextResponse.json(
        { error: "Only owner or admin can invite members" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    if (team.isMember(email)) {
      return NextResponse.json(
        { error: "User is already a team member" },
        { status: 400 }
      );
    }

    // Check if email already has pending invitation
    const existingInvitation = team.pendingInvitations.find(
      (inv: any) => inv.email.toLowerCase() === email.toLowerCase()
    );

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invitation
    const invitation = {
      email: email.toLowerCase().trim(),
      role,
      token,
      invitedBy: user._id,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    team.pendingInvitations.push(invitation);
    await team.save();

    // Send invitation email
    const inviteUrl = `${
      process.env.NEXTAUTH_URL || `https://${config.domainName}`
    }/invite/${token}`;

    try {
      await resend.emails.send({
        from: config.resend.fromNoReply,
        to: email,
        subject: `You've been invited to join ${team.name} on ${config.appName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="color-scheme" content="light">
              <meta name="supported-color-schemes" content="light">
            </head>
            <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8f5 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <!-- Wrapper -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e8f5 100%);">
                <tr>
                  <td style="padding: 40px 20px;">
                    <!-- Main Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background: #ffffff; border-radius: 16px; box-shadow: 0 1px 0 0 rgba(255,255,255,0.1) inset, 0 8px 32px rgba(0,0,0,0.08);">
                      
                      <!-- Header with gradient -->
                      <tr>
                        <td style="padding: 48px 48px 32px; text-align: center; background: linear-gradient(135deg, oklch(0.623 0.214 259.815) 0%, oklch(0.546 0.245 262.881) 100%); border-radius: 16px 16px 0 0;">
                          <div style="display: inline-block; padding: 12px 24px; background: rgba(255,255,255,0.15); border-radius: 12px; backdrop-filter: blur(10px); margin-bottom: 16px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">${
                              config.appName
                            }</h1>
                          </div>
                          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500;">Team Invitation</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 48px 48px 32px;">
                          <!-- Greeting -->
                          <h2 style="margin: 0 0 24px; color: #1a1a1a; font-size: 24px; font-weight: 700; line-height: 1.3;">
                            You've been invited! 🎉
                          </h2>
                          
                          <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            <strong style="color: #1a1a1a;">${
                              user.name || user.email
                            }</strong> has invited you to join their team on ${
          config.appName
        }.
                          </p>
                          
                          <!-- Team Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px; background: linear-gradient(to bottom right, #f8f8fc, #f0f0f8); border-radius: 12px; box-shadow: 0 1px 0 0 rgba(255,255,255,0.1) inset, 0 4px 16px rgba(0,0,0,0.06);">
                            <tr>
                              <td style="padding: 24px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding-bottom: 12px;">
                                      <p style="margin: 0; color: #6b6b6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Team Name</p>
                                      <p style="margin: 4px 0 0; color: #1a1a1a; font-size: 20px; font-weight: 700;">${
                                        team.name
                                      }</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06);">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                          <td style="padding-right: 32px;">
                                            <p style="margin: 0; color: #6b6b6b; font-size: 13px;">Your Role</p>
                                            <p style="margin: 4px 0 0; display: inline-block; padding: 6px 14px; background: oklch(0.623 0.214 259.815); color: #ffffff; font-size: 13px; font-weight: 600; text-transform: capitalize; border-radius: 20px;">${role}</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- CTA Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px;">
                            <tr>
                              <td style="text-align: center;">
                                <a href="${inviteUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, oklch(0.623 0.214 259.815) 0%, oklch(0.546 0.245 262.881) 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 1px 0 0 rgba(255,255,255,0.2) inset, 0 4px 16px rgba(98, 84, 234, 0.25); transition: transform 0.2s;">
                                  Accept Invitation →
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Info boxes -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px;">
                            <tr>
                              <td style="padding: 16px 20px; background: rgba(250, 243, 221, 0.5); border-left: 3px solid oklch(0.828 0.189 84.429); border-radius: 8px;">
                                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">
                                  ⏰ <strong>This invitation expires in 24 hours.</strong> Accept it soon to join the team!
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 0 0 16px; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                            If you didn't expect this invitation, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 32px 48px; background: linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.04)); border-top: 1px solid rgba(0,0,0,0.06); border-radius: 0 0 16px 16px;">
                          <p style="margin: 0 0 16px; color: #6b6b6b; font-size: 13px; line-height: 1.5;">
                            <strong>Button not working?</strong> Copy and paste this link into your browser:
                          </p>
                          <p style="margin: 0 0 24px; word-break: break-all;">
                            <a href="${inviteUrl}" style="color: oklch(0.623 0.214 259.815); text-decoration: none; font-size: 12px;">${inviteUrl}</a>
                          </p>
                          
                          <p style="margin: 0; color: #9b9b9b; font-size: 12px; text-align: center;">
                            © ${new Date().getFullYear()} ${
          config.appName
        }. Secure environment variable management.
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      // Remove the invitation if email fails
      team.pendingInvitations = team.pendingInvitations.filter(
        (inv: any) => inv.token !== token
      );
      await team.save();

      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Invitation sent successfully",
        invitation: {
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}

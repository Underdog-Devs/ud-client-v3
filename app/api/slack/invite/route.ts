import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST() {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const text = `${user.user_metadata.role.charAt(0).toUpperCase() + user.user_metadata.role.slice(1)} ${user.email} wants to join the Slack workspace`;

    const result = await slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || "",
      text: text,
    });
    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Invitation sent successfully",
      });
    } else {
      throw new Error(`Failed to send invitation: ${result.error}`);
    }
  } catch (error) {
    console.error("Slack invitation error:", error);
    return NextResponse.json(
      { error: "Failed to send Slack invitation", details: error },
      { status: 500 }
    );
  }
}

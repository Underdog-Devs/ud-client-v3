import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверяем существующие запросы за последние 24 часа
    const { data: existingRequest } = await supabase
      .from('slack_join_requests')
      .select()
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: "You have already requested to join. Please wait for approval." },
        { status: 429 }
      );
    }

    // Создаем новый запрос
    const { error: insertError } = await supabase
      .from('slack_join_requests')
      .insert([{ user_id: user.id }]);

    if (insertError) {
      throw new Error("Failed to create join request");
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
      throw new Error("Failed to send invitation");
    }
  } catch (error) {
    console.error("Slack invitation error:", error);
    return NextResponse.json(
      { error: "Failed to send Slack invitation", details: error },
      { status: 500 }
    );
  }
}

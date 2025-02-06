import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST() {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate invite link
    const result = await slackClient.admin.users.invite({
      email: user.email,
      channel_ids: [process.env.SLACK_CHANNEL_ID],
      team_id: process.env.SLACK_TEAM_ID,
    });

    if (result.ok) {
      return NextResponse.json({ 
        success: true,
        message: 'Invitation sent successfully'
      });
    } else {
      throw new Error('Failed to send invitation');
    }
  } catch (error) {
    console.error('Slack invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to send Slack invitation' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { z } from "zod";

// Get all completed quizzes for the current user
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
  .from('user_progress')
  .select(`
    quiz_id,
    quizzes (
      slug
    )
  `);

  if (error) {
    return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data, success: true
  });
}

// Mark quiz as completed for the current user
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const quizSchema = z.object({ 
    slug: z.string(),
  });       

  const parsedBody = quizSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body - must include slug (string)" }, { status: 400 });
  }
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('id')
    .eq('slug', parsedBody.data.slug)
    .single();

  if (quizError || !quizData) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: "User not found", message: userError?.message }, { status: 401 }); 
  }
  
  const progressData = {
    user_id: user.id,
    quiz_id: quizData.id
  };

  const { data, error } = await supabase
    .from('user_progress')
    .insert(progressData);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Error marking quiz as completed", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}
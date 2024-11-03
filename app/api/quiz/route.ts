import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";


// Create a new quiz
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const quizSchema = z.object({
    slug: z.string(),
    });

  const parsedBody = quizSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body - must include slug (string)" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("quizzes")
    .insert(parsedBody.data)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Error creating quiz", message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data,
  });
}

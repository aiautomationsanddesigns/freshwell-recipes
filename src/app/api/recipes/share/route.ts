import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";

function generateShareCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipe } = body as { recipe: Recipe };

    if (!recipe?.title) {
      return NextResponse.json({ error: "Invalid recipe data." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const shareCode = generateShareCode();

    const { error } = await supabase.from("shared_recipes").insert({
      share_code: shareCode,
      recipe_data: recipe,
      created_by: user?.id || null,
    });

    if (error) {
      console.error("[Share] Insert failed:", error);
      return NextResponse.json({ error: "Failed to create share link." }, { status: 500 });
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    return NextResponse.json({
      shareCode,
      shareUrl: `${origin}/shared/${shareCode}`,
    });
  } catch (error) {
    console.error("[Share] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

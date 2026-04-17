import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("player_id");

  const supabase = createServiceClient();
  let query = supabase
    .from("evaluations")
    .select("*")
    .eq("coach_user_id", userId)
    .order("created_at", { ascending: false });

  if (playerId) query = query.eq("player_id", playerId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { player_id, technical, game_iq, physical, mental, overall, coach_note, strengths, focus_areas } = body;

  if (!player_id || !technical || !game_iq || !physical || !mental) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      player_id,
      coach_user_id: userId,
      technical,
      game_iq,
      physical,
      mental,
      overall,
      coach_note: coach_note || null,
      strengths: strengths ?? [],
      focus_areas: focus_areas ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

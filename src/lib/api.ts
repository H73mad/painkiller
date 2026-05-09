import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function requireUser() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { ok: true as const, userId: session.user.id };
}

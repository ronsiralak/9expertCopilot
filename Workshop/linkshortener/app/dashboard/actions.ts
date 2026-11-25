"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { shortenedLinks } from "@/db/schema";

export async function updateLink(shortCode: string, formData: FormData) {
  const { userId } = await auth.protect({ unauthenticatedUrl: "/" });
  const value = formData.get("url");
  const url = typeof value === "string" ? value.trim() : "";

  if (
    !URL.canParse(url) ||
    !["http:", "https:"].includes(new URL(url).protocol)
  ) {
    redirect(`/dashboard?edit=${encodeURIComponent(shortCode)}&error=invalid-url`);
  }

  const updated = await db
    .update(shortenedLinks)
    .set({ url })
    .where(
      and(
        eq(shortenedLinks.shortCode, shortCode),
        eq(shortenedLinks.clerkUserId, userId),
      ),
    )
    .returning({ shortCode: shortenedLinks.shortCode });

  if (updated.length === 0) {
    redirect("/dashboard?error=not-found");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteLink(shortCode: string) {
  const { userId } = await auth.protect({ unauthenticatedUrl: "/" });
  const deleted = await db
    .delete(shortenedLinks)
    .where(
      and(
        eq(shortenedLinks.shortCode, shortCode),
        eq(shortenedLinks.clerkUserId, userId),
      ),
    )
    .returning({ shortCode: shortenedLinks.shortCode });

  if (deleted.length === 0) {
    redirect("/dashboard?error=not-found");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

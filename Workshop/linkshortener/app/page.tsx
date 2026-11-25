import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Link2, List, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-400">
            <Link2 aria-hidden="true" className="size-3.5" />
            Linkshortener
          </div>
          <h1 className="mt-7 max-w-xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Your links.
            <br />
            <span className="text-muted-foreground">One simple space.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            Keep your shortened links together and find them whenever you need
            them.
          </p>
          <div className="mt-8">
            <SignInButton mode="modal">
              <Button size="lg" className="h-11 gap-2 px-5">
                Sign in to your dashboard
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </SignInButton>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/40 p-6 sm:p-8 dark:bg-white/[0.03]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-700 dark:text-emerald-400">
            <Link2 aria-hidden="true" className="size-6" />
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Your workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            A clearer view of your links
          </h2>
          <div className="mt-6 space-y-5 border-t pt-6">
            <div className="flex items-start gap-3">
              <List aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <p className="text-sm leading-6 text-muted-foreground">
                View your shortened links in one organized list.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in to see the links associated with your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

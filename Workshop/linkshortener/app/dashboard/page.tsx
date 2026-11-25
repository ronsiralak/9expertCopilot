import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { ExternalLink, Link2, List, Pencil, Search, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { shortenedLinks } from "@/db/schema";
import { deleteLink, updateLink } from "./actions";
import { SearchLinks } from "./search-links";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string;
    delete?: string;
    error?: string;
    q?: string | string[];
  }>;
}) {
  const { userId } = await auth.protect({ unauthenticatedUrl: "/" });
  const params = await searchParams;
  const links = await db
    .select({ shortCode: shortenedLinks.shortCode, url: shortenedLinks.url })
    .from(shortenedLinks)
    .where(eq(shortenedLinks.clerkUserId, userId))
    .orderBy(desc(shortenedLinks.createdAt), shortenedLinks.shortCode);
  const search = typeof params.q === "string" ? params.q.trim() : "";
  const searchTerm = search.toLowerCase();
  const filteredLinks = links.filter(
    (link) =>
      link.shortCode.toLowerCase().includes(searchTerm) ||
      link.url.toLowerCase().includes(searchTerm),
  );
  const linkToDelete = links.find((link) => link.shortCode === params.delete);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
      <div className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Your workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            All your shortened links, in one place.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 dark:bg-white/[0.03]">
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-700 dark:text-emerald-400">
            <Link2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Total links</p>
            <p className="text-lg font-semibold tabular-nums">{links.length}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="links-heading" className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground dark:bg-white/[0.03]">
            <List aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 id="links-heading" className="text-lg font-semibold">
              Your links
            </h2>
            <p className="text-sm text-muted-foreground">
              Your links, newest first
            </p>
          </div>
        </div>

        <SearchLinks search={search} />

        {params.error === "not-found" && (
          <p role="alert" className="mb-5 text-sm text-destructive">
            This link could not be found or is no longer available.
          </p>
        )}

        {linkToDelete && (
          <form
            action={deleteLink.bind(null, linkToDelete.shortCode)}
            className="mb-5 space-y-4 rounded-2xl border bg-muted/40 p-5 dark:bg-white/[0.02]"
          >
            <div>
              <h3 className="font-semibold">Delete link?</h3>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                Delete {linkToDelete.shortCode}? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="destructive">Delete link</Button>
              <a href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                Cancel
              </a>
            </div>
          </form>
        )}

        {links.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center dark:bg-white/[0.02]">
            <Link2 aria-hidden="true" className="mx-auto size-6 text-emerald-700 dark:text-emerald-400" />
            <p className="mt-4 font-medium">No links yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your shortened links will appear here.
            </p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center dark:bg-white/[0.02]">
            <Search aria-hidden="true" className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-4 font-medium">No matching links</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different short code or URL.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-muted/40 dark:bg-white/[0.02]">
            <Table className="min-w-[36rem] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="w-36 px-5 sm:w-52 sm:px-6">
                    Short code
                  </TableHead>
                  <TableHead scope="col" className="px-5 sm:px-6">
                    URL
                  </TableHead>
                  <TableHead scope="col" className="w-40 px-2 text-right sm:w-48 sm:px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => {
                  const isValidUrl =
                    URL.canParse(link.url) &&
                    ["http:", "https:"].includes(new URL(link.url).protocol);

                  return (
                    <TableRow key={link.shortCode}>
                      <TableCell className="break-all whitespace-normal px-5 py-5 font-mono text-sm font-medium sm:px-6">
                        {link.shortCode}
                      </TableCell>
                      <TableCell className="break-all whitespace-normal px-5 py-5 text-sm leading-6 text-muted-foreground sm:px-6">
                        {link.url}
                      </TableCell>
                      <TableCell className="px-2 py-5 text-right sm:px-6">
                        <div className="inline-flex items-center gap-1">
                          {isValidUrl ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${link.shortCode} in a new tab`}
                              className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                              Open
                              <ExternalLink aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">Invalid URL</span>
                          )}
                          <Dialog defaultOpen={params.edit === link.shortCode}>
                            <DialogTrigger
                              aria-label={`Edit ${link.shortCode}`}
                              title="Edit link"
                              className={buttonVariants({ variant: "outline", size: "icon-sm" })}
                            >
                              <Pencil aria-hidden="true" />
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit link</DialogTitle>
                                <DialogDescription className="break-all">
                                  Short code: {link.shortCode}
                                </DialogDescription>
                              </DialogHeader>
                              <form action={updateLink.bind(null, link.shortCode)} className="space-y-4">
                                <div className="space-y-2">
                                  <label htmlFor={`edit-url-${link.shortCode}`} className="text-sm font-medium">
                                    Destination URL
                                  </label>
                                  <Input
                                    id={`edit-url-${link.shortCode}`}
                                    name="url"
                                    type="url"
                                    defaultValue={link.url}
                                    required
                                  />
                                  {params.edit === link.shortCode && params.error === "invalid-url" && (
                                    <p role="alert" className="text-sm text-destructive">
                                      Enter a valid HTTP or HTTPS URL.
                                    </p>
                                  )}
                                </div>
                                <DialogFooter>
                                  <DialogClose render={<Button type="button" variant="outline" />}>
                                    Cancel
                                  </DialogClose>
                                  <Button type="submit">Save changes</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <a
                            href={`/dashboard?delete=${encodeURIComponent(link.shortCode)}`}
                            aria-label={`Delete ${link.shortCode}`}
                            title="Delete link"
                            className={buttonVariants({ variant: "outline", size: "icon-sm" })}
                          >
                            <Trash2 aria-hidden="true" />
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}

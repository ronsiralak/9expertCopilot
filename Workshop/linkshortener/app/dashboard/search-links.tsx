"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

export function SearchLinks({ search }: { search: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef<string | null>(null);

  useEffect(() => {
    if (submittedRef.current === search) {
      submittedRef.current = null;
    } else if (timerRef.current === null && submittedRef.current === null && inputRef.current) {
      inputRef.current.value = search;
    }
  }, [search]);

  useEffect(() => {
    function handleHistoryChange() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      submittedRef.current = null;
      if (inputRef.current) {
        inputRef.current.value = new URLSearchParams(window.location.search).get("q") ?? "";
      }
    }

    window.addEventListener("popstate", handleHistoryChange);
    return () => {
      window.removeEventListener("popstate", handleHistoryChange);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(value: string) {
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const params = new URLSearchParams(window.location.search);
      const query = value.trim();
      if ((params.get("q") ?? "").trim() === query && submittedRef.current === null) return;

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      params.delete("edit");
      params.delete("delete");
      params.delete("error");
      submittedRef.current = query;
      const queryString = params.toString();
      router.replace(queryString ? `/dashboard?${queryString}` : "/dashboard", { scroll: false });
    }, 300);
  }

  return (
    <div role="search" className="mb-5">
      <label htmlFor="search-links" className="sr-only">
        Search short codes or URLs
      </label>
      <Input
        ref={inputRef}
        id="search-links"
        name="q"
        type="search"
        placeholder="Search short codes or URLs"
        defaultValue={search}
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
}

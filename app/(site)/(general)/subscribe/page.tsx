"use client";

import { Metadata } from "next";
import Script from "next/script";
import H1 from "@/app/components/common/h1";

export default function SubscribePage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Subscribe to Baseline</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Welcome to Body Baseline. Every week we'll send you the newest technology, advice and supplements to help you manage your weight.
        </p>

        {/* Beehiiv script */}
        <Script
          src="https://subscribe-forms.beehiiv.com/embed.js"
          strategy="afterInteractive"
        />

        {/* Beehiiv iframe */}
      <div className="mt-10 w-full flex items-center justify-center">
                <iframe
                    src="https://subscribe-forms.beehiiv.com/1dd432d7-8759-417a-981f-6010888bd3d8"
                    className="beehiiv-embed w-full"
                    data-test-id="beehiiv-embed"
                    style={{
                    width: "100%",
                    minHeight: "380px", // mobile tends to need a bit more
                    backgroundColor: "transparent",
                    }}
                />
        </div>
      </section>
    </main>
  );
}

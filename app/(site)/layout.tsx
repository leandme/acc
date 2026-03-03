import "../styles/globals.css";
import { Suspense } from "react";

import AmplitudeInitializer from "../components/helpers/amplitude-initializer";
import Footer from "../components/common/footer";
import { Toaster } from "react-hot-toast";
import { AuthorSchema } from "../components/schema/author-schema";
import { OrgSchema } from "../components/schema/org-schema";
import { SiteNavSchema } from "../components/schema/site-nav-schema";
import { WebsiteSchema } from "../components/schema/website-schema";
import { GoogleTag } from "../components/helpers/google-tag";
import { GoogleAnalytics } from "../components/helpers/google-analytics";
import Chrome from "../components/common/chrome";
import { Ezoic } from "../components/helpers/ezoic";
import { EzoicAdsRunner } from "../components/helpers/ezoic-ads-runner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <Ezoic /> */} 
        <GoogleTag />
        <GoogleAnalytics />
        <WebsiteSchema />
        <SiteNavSchema />
        <OrgSchema />
        <AuthorSchema />
      </head>

      <body className="bg-base-100 text-base-content">
        <AmplitudeInitializer />
        <EzoicAdsRunner />

        <Suspense
          fallback={
            // IMPORTANT: fallback must NOT use client hooks
            <>
              <main className="container mx-auto px-4 lg:px-8 lg:py-8 min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
            </>
          }
        >
          <Chrome>
            <main className="container mx-auto px-4 lg:px-8 lg:py-8 min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </Chrome>
        </Suspense>
      </body>
    </html>
  );
}

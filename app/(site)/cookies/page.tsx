import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Body Fat Estimator AI",
  description:
    "",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-16">
      <h1 className="text-4xl text-center font-bold mb-6">Cookies Policy</h1>

      <p className="mb-4 text-lg">
        This Cookies Policy explains how Body Fat Estimator uses cookies and similar
        technologies when you visit or use our website. By continuing to use the site,
        you consent to the use of cookies as described in this policy.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website.
          They help websites function properly, remember preferences, analyze usage,
          and deliver relevant content or advertisements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
        <p className="mb-2">
          Body Fat Estimator uses cookies for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Essential cookies:</strong> Required for the website to function
            correctly, such as maintaining sessions and basic functionality.
          </li>
          <li>
            <strong>Analytics cookies:</strong> Used to understand how visitors interact
            with the site, helping us improve performance and user experience.
          </li>
          <li>
            <strong>Advertising cookies:</strong> Used to display ads and measure their
            effectiveness. These cookies may be set by third-party advertising partners.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
        <p className="mb-2">
          We may allow third-party services such as analytics providers and advertising
          networks to place cookies on your device. These third parties may collect
          information about your online activities over time and across different websites.
        </p>
        <p>
          We do not control these cookies. Please refer to the respective third-party
          privacy and cookies policies for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
        <p className="mb-2">
          You can control or disable cookies through your browser settings. Please note
          that disabling cookies may affect the functionality of the website and your
          ability to use certain features.
        </p>
        <p>
          Most browsers allow you to delete existing cookies, block future cookies, or
          notify you before a cookie is stored.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
        <p>
          We may update this Cookies Policy from time to time. Any changes will be posted
          on this page and will take effect immediately upon publication.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about this Cookies Policy, please contact us at{" "}
          <a
            href="mailto:matt@leandme.com"
            className="text-blue-500 hover:underline"
          >
            matt@leandme.com
          </a>.
        </p>
        <div className="mt-10 pb-10 text-left">
          <p className="text-sm text-gray-400">
            Last updated: 11/01/2026
          </p>
        </div>
      </section>
    </div>
  );
}

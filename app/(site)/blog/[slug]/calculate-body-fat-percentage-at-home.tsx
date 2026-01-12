import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Calculate Your Body Fat Percentage at Home",
  description:
    "",
};

export default function ContactPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">How to Calculate Your Body Fat Percentage at Home</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Questions about your AI body fat estimate, pricing, refunds, or privacy?
          Email us and we’ll get back to you as soon as we can.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href="mailto:matt@leandme.com"
            className="btn btn-primary text-white"
          >
            Email Support
          </a>
        </div>

      </section>



    </main>
  );
}

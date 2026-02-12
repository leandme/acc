import { Metadata } from "next";
import { MoreTools } from "./more-tools";

export const metadata: Metadata = {
  title: "XX",
  description:
    "YY",
};

export default function ZZ() {
  return (
    <main className="bg-base-100">


      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">

        {/* What your results mean */}
        {/* Charts */}
        {/* How accurate your results are */}
        {/* Next steps */}
        <MoreTools columns={2} toolSlugs={["ffmi-calculator"]} />
      </section>
    </main>
  );
}

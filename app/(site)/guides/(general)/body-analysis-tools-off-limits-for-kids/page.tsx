import { Metadata } from "next";
import Image from "next/image";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";
import References from "@/app/components/guides/guide-references";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Protecting Kids Online: Why Body Analysis Tools Should Be Off-Limits",
  description:
    "Body analysis tools can create privacy, consent, and body-image risks for minors. Learn why these tools should be off-limits for children and what parents should focus on instead.",
  canonical:
    "https://bodyfatestimator.ai/guides/body-analysis-tools-off-limits-for-kids",
});

export default function BodyAnalysisToolsOffLimitsForKidsPage() {
  return (
    <main className="bg-base-100 pt-10">
      <GuideHero
        slug="body-analysis-tools-off-limits-for-kids"
        title="Protecting Kids Online: Why Body Analysis Tools Should Be Off-Limits"
        intro={
          <>
            <p>
              The internet is full of tools that promise to analyze photos and
              turn appearance into numbers. For adults, those tools are often
              framed as fitness or self-improvement.
            </p>
            <p>
              Children are a different story. When a person is under 18,
              privacy, consent, and interpretation risks rise fast. This is why
              body analysis tools should be off-limits for minors.
            </p>
          </>
        }
        image={
          <figure className="max-w-3xl">
            <Image
              src="/examples/man-selfie.webp"
              alt="Child taking a selfie on a phone"
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 100vw, 768px"
              className="rounded-xl border h-auto w-full object-cover"
            />
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              Not every tool that can analyze a photo should be used on kids.
            </figcaption>
          </figure>
        }
      />

      <section className="mx-auto mt-16 lg:mt-24 max-w-3xl px-6 pb-20 [&>div+div]:mt-20 lg:[&>div+div]:mt-40">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            What Body Analysis Tools Actually Do
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Body analysis tools cover a wide range of features. Some estimate
            body fat from a photo. Some assess shape, posture, or proportions.
            Others score facial symmetry or physical traits from visual cues.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Even for adults, these outputs are estimates, not medical
            measurements. They can be useful for trend tracking, but they are
            still approximations.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            The mistake is assuming that if a tool seems reasonable for adults,
            it must also be appropriate for teenagers or younger children. That
            assumption breaks down quickly.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Children Are Still Developing
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Children are not smaller adults. Their bodies are changing
            constantly through growth spurts, puberty, and normal developmental
            variation.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            A number that looks precise on a screen can be misleading in this
            context. A normal stage of development can be interpreted as a
            problem when it is not.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Once a score exists, people tend to treat it as objective. That is
            risky when the underlying signal is unstable and the person is still
            growing.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Most Tools Are Built For Adults, Not Minors
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Most consumer body analysis tools are designed around adult data and
            adult use cases. They are rarely validated as pediatric tools.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            The output can still look authoritative because it is shown as a
            percentage or score, but surface precision does not guarantee that
            the model is suitable for children.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Adults may choose to use these tools while understanding limits.
            Children usually do not make that choice themselves.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Privacy Risks Are Bigger When Kids Are Involved
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Uploading any photo raises privacy questions: where is the image
            stored, how long is it kept, and whether it is reused for model
            training or shared with third parties.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Those risks are more serious when the image belongs to a child.
            Children cannot meaningfully consent to creating a long-term digital
            record about their body.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Parents building a safer digital environment can also use resources
            like Safe Search Kids for practical online safety guidance.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Body Image Harm Can Start Earlier Than People Think
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Kids already grow up in environments full of comparison and
            appearance pressure. Adding body-scoring tools can intensify that
            pressure.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            A result that adults see as casual can stick with a child. They may
            internalize the message that their body should be monitored,
            measured, and judged.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Health support is one thing. Early obsessive body awareness is
            another. This line matters.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Consent Is Not Just A Checkbox
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Informed consent requires understanding long-term implications.
            Children cannot do this the same way adults can.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Parents make many decisions on behalf of children, but good
            judgment includes restraint when a tool may create more harm than
            benefit.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Some technologies are better left unused in childhood contexts, even
            if they are popular with adults.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            What Adults Should Focus On Instead
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            If the goal is to support a child&apos;s health, better signals exist:
            sleep quality, activity level, energy, confidence, and overall
            wellbeing.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            If there is a genuine health concern, that conversation belongs with
            qualified professionals, not image-based consumer scoring tools.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
            <li>Prioritize habits and routines over appearance-based scores.</li>
            <li>Encourage sports and movement for skill and enjoyment.</li>
            <li>Protect privacy by minimizing photo uploads to unknown tools.</li>
            <li>Keep body conversations supportive, not evaluative.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Bottom Line
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Not everything that can be measured should be measured. Body
            analysis tools may have a role for informed adults, but they are not
            appropriate for children.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Protecting kids online is not only about blocking obvious threats.
            It is also about setting clear boundaries around tools that can
            affect privacy, development, and self-image.
          </p>
        </div>

        <References
          references={[
            {
              label: "FTC - Children's Online Privacy Protection Rule (COPPA)",
              href: "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa",
            },
            {
              label: "FTC - Children's Privacy Guidance",
              href: "https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy",
            },
          ]}
        />

        <MoreArticles
          currentSlug="body-analysis-tools-off-limits-for-kids"
          basePath="/guides"
          articles={[
            {
              slug: "how-accurate-is-ai-body-fat-estimation",
              title: "How Accurate is AI Body Fat Estimation?",
              tag: "fat",
              description:
                "Learn how accuracy differs from consistency and how to use photo-based tools with realistic expectations.",
              date: "Jan 27, 2026",
              readTime: "6 min read",
              image: "/guides/how-accurate-is-ai-body-fat-estimation.webp",
            },
            {
              slug: "body-fat-calculator-vs-estimator",
              title:
                "Body Fat Calculator vs Body Fat Estimator - What's the Difference?",
              tag: "fat",
              description:
                "Understand how body fat calculators and image-based estimators differ, and why interpretation matters.",
              date: "Jan 4, 2026",
              readTime: "6 min read",
              image: "/guides/body-fat-calculator-vs-estimator.webp",
            },
          ]}
        />
      </section>
    </main>
  );
}

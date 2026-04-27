import FaqSection from "../common/faq-section";

export default function FAQ() {
  const FAQ_ITEMS = [
    {
      q: "How accurate is AI Calorie Counter?",
      a: (
        <>
          AI Calorie Counter is designed for practical, directional calorie tracking. Accuracy can
          vary by photo quality, portion visibility, and hidden ingredients, so results are best
          used for trend tracking rather than exact lab-level measurement.
        </>
      ),
    },
    {
      q: "Can AI really estimate calories from food photos?",
      a: (
        <>
          Yes. The model estimates likely foods, portion size, and preparation density from the
          image, then returns a calorie estimate and range.
        </>
      ),
    },
    {
      q: "Can I analyze multiple food items in one image?",
      a: (
        <>
          Yes. Multi-item meals are supported. The result includes a total estimate and item-level
          breakdown where detection confidence is sufficient.
        </>
      ),
    },
    {
      q: "What nutritional information does the tool provide?",
      a: (
        <>
          You get estimated total calories, a calorie range, confidence level, and macro split
          (protein, carbs, and fat) when available.
        </>
      ),
    },
    {
      q: "Is AI Calorie Counter free to use?",
      a: (
        <>
          Yes. The core experience is free, so you can upload food photos and get estimates
          without a paid subscription.
        </>
      ),
    },
    {
      q: "How does AI Calorie Counter identify food from images?",
      a: (
        <>
          It uses computer vision to detect food patterns and contextual cues in your photo, then
          estimates likely items and portions before calculating calories.
        </>
      ),
    },
    {
      q: "Can I scan my meal for calories online?",
      a: (
        <>
          Yes. Upload directly from your phone or desktop and receive results in your browser.
        </>
      ),
    },
    {
      q: "How accurate are AI food scanners compared to manual calorie tracking?",
      a: (
        <>
          Manual tracking with weighed portions can be more precise, but AI scanners are usually
          faster and easier to maintain consistently. For many users, consistency beats perfection.
        </>
      ),
    },
    {
      q: "Does AI Calorie Counter save my scans or track my meals automatically?",
      a: (
        <>
          The tool processes uploads to generate results. We do not sell your photos, and we aim to
          minimize retention. Review our privacy and terms pages for full details.
        </>
      ),
    },
    {
      q: "What foods can the AI recognize?",
      a: (
        <>
          It works best with common meals, snacks, drinks, and mixed plates. Recognition can be
          less reliable when ingredients are hidden, heavily covered, or visually ambiguous.
        </>
      ),
    },
    {
      q: "Can AI Calorie Counter estimate macros automatically?",
      a: (
        <>
          Yes. The result includes estimated protein, carbs, and fat split, plus gram values when
          enough confidence is available.
        </>
      ),
    },
    {
      q: "Can AI estimate portion size and serving weight from pictures?",
      a: (
        <>
          It can estimate portion size directionally from visual cues, but serving weight is still
          an inference. For high-precision nutrition planning, combine AI estimates with weighing.
        </>
      ),
    },
    {
      q: "Can the tool analyze restaurant meals or recipes?",
      a: (
        <>
          Yes. Restaurant and mixed meals are supported, but hidden oils, sauces, and preparation
          details can increase uncertainty. Use the returned range for practical decision-making.
        </>
      ),
    },
    {
      q: "Are AI food scanners safe to use?",
      a: (
        <>
          For general meal tracking, yes. They are informational tools, not medical devices. If you
          have clinical dietary needs, follow a registered dietitian or physician’s plan first.
        </>
      ),
    },
    {
      q: "What makes AI Calorie Counter different from other food scanner apps?",
      a: (
        <>
          It focuses on a fast web-based workflow, clear calorie ranges, confidence signaling, and
          practical output for daily tracking without app store friction.
        </>
      ),
    },
    {
      q: "What is the best free AI food scanner in 2026?",
      a: (
        <>
          The best tool is the one you will actually use consistently. AI Calorie Counter is built
          to be free, fast, and simple so daily calorie tracking is easier to maintain.
        </>
      ),
    },
    {
      q: "How can I contact support?",
      a: (
        <>
          Questions or feedback can be sent by{" "}
          <a href="mailto:matt@leandme.com" className="text-primary">
            email
          </a>{" "}
          and we will help as quickly as possible.
        </>
      ),
    },
  ];

  return (
    <FaqSection
      id="faqs"
      accordionName="home-faq-accordion"
      heading="AI Calorie Counter FAQ"
      description="Answers to common questions about AI food scanning, calorie estimates, and macro tracking."
      items={FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))}
      className="mt-0"
    />
  );
}

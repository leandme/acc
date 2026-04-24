import FaqSection from "../common/faq-section";

export default function FAQ() {

  const FAQ_ITEMS = [
    {
      q: "How does the body fat calculator work?",
      a: (
        <>
          Upload a clear full-body photo and the AI analyzes visual cues like shape, fat
          distribution, and proportions to estimate body fat percentage. This is a photo-based
          estimate, so photo quality, lighting, pose, and clothing affect results.
        </>
      ),
    },
    {
      q: "What data does Body Fat Estimator AI require from users?",
      a: (
        <>
          The core input is a clear, recent full-body photo. Better results usually come from
          neutral posture, even lighting, and fitted clothing that does not hide body shape.
        </>
      ),
    },
    {
      q: "Can I use my smartphone to assess my body fat percentage?",
      a: (
        <>
          Yes. Most users upload smartphone photos. Use good lighting, keep the camera level, and
          take the photo from a consistent distance each time.
        </>
      ),
    },
    {
      q: "Is the body fat calculator easy to use?",
      a: (
        <>
          Yes. Upload your photo, wait for the estimate, and review the range and guidance. No tape
          measurements or manual formulas are required.
        </>
      ),
    },
    {
      q: "How accurate is the body fat calculator?",
      a: (
        <>
          It is designed to be directionally accurate, especially for tracking changes over time.
          It is not a medical test like DEXA, so use it as a trend tool rather than an exact
          clinical measurement.
        </>
      ),
    },
    {
      q: "How can I improve the accuracy of my results?",
      a: (
        <>
          Use the accuracy panel recommendations as a checklist before your next upload:
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Provide front, side, and back photos in neutral, even lighting without strong
              window light or hard shadows.
            </li>
            <li>
              Include a fully relaxed stance and a non-flexed abdomen in addition to any flexed
              poses.
            </li>
            <li>
              Stand farther from the camera so the full body from head to ankles is visible with
              consistent framing.
            </li>
            <li>
              Wear form-fitting shorts so hip and upper-thigh fat distribution is visible.
            </li>
            <li>
              Add a straight-on photo with arms at your sides to better assess waist-to-shoulder
              ratio and abdominal definition.
            </li>
            <li>
              Avoid morning pump or immediate post-workout photos to reduce temporary muscle
              fullness affecting visible definition.
            </li>
          </ul>
        </>
      ),
    },
    {
      q: "How quickly can I get my results?",
      a: (
        <>
          Most results are returned in seconds. Very large images or slow connections can take a
          little longer.
        </>
      ),
    },
    {
      q: "Can I track my progress over time?",
      a: (
        <>
          Yes. That is one of the best use cases. Take photos under similar conditions every one
          to two weeks and compare trend direction instead of focusing on one single estimate.
        </>
      ),
    },
    {
      q: "How does AI enhance body composition analysis?",
      a: (
        <>
          AI can evaluate many visual signals at once and apply them consistently. This helps turn
          photos into a repeatable body-fat estimate workflow when your photo setup is consistent.
        </>
      ),
    },
    {
      q: "Can I compare results with traditional methods?",
      a: (
        <>
          Yes. Many people compare AI estimates with formula-based calculators or occasional scans.
          Comparing methods can give better context than relying on one method alone.
        </>
      ),
    },
    {
      q: "How does lighting affect the analysis results?",
      a: (
        <>
          Lighting has a major impact. Harsh shadows or low light can hide or exaggerate visual
          definition, which can shift the estimate. Even, front-facing light works best.
        </>
      ),
    },
    {
      q: "What should I wear for the best results?",
      a: (
        <>
          Wear fitted clothing that allows clear body-shape visibility, such as athletic wear.
          Avoid baggy outfits, heavy layers, and poses that distort posture.
        </>
      ),
    },
    {
      q: "How often should I use the calculator?",
      a: (
        <>
          Every one to two weeks is usually enough for meaningful trend tracking. Daily checks often
          add noise without useful signal.
        </>
      ),
    },
    {
      q: "What are the limitations of the body fat calculator?",
      a: (
        <>
          It is appearance-based, not a diagnostic tool. Results can vary with lighting, pose,
          camera angle, and clothing, so it is best for trend tracking rather than medical
          decision-making.
        </>
      ),
    },
    {
      q: "Can I use photos from social media for analysis?",
      a: (
        <>
          You can, but results are usually less reliable because social photos often include filters,
          strong edits, non-neutral poses, or difficult lighting. A fresh, neutral photo is better.
        </>
      ),
    },
    {
      q: "Is there a cost associated with using this tool?",
      a: (
        <>
          The body fat estimator includes a free experience for quick estimates.
        </>
      ),
    },
    {
      q: "Are there any privacy concerns with Body Fat Estimator AI?",
      a: (
        <>
          Privacy matters. Photos are processed to generate your estimate and are not sold. We aim
          to minimize retention and protect user data.
        </>
      ),
    },
    {
      q: "Can I use the tool without an internet connection?",
      a: (
        <>
          No. The estimator runs online, so you need an internet connection to upload a photo and
          receive results.
        </>
      ),
    },
    {
      q: "How does the calculator handle different body types?",
      a: (
        <>
          The tool is designed for broad body-type coverage, but quality can still vary by photo
          conditions and individual variance. Consistent photos improve reliability for everyone.
        </>
      ),
    },
    {
      q: "What support does Body Fat Estimator AI offer users?",
      a: (
        <>
          If you have questions, contact us via{" "}
          <a href="mailto:matt@leandme.com" className="text-primary">
            email
          </a>{" "}
          and we will help.
        </>
      ),
    },
  ];

  return (
    <FaqSection
      id="faqs"
      accordionName="home-faq-accordion"
      heading="Body Fat Calculator FAQ"
      description="Answers to common questions about our AI-powered body fat estimation tool."
      items={FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))}
      className="mt-0"
    />
  );
}

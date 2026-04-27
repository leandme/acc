import FaqSection from "../common/faq-section";

export default function FAQ() {
  const FAQ_ITEMS = [
    {
      q: "How does AI Calorie Counter estimate calories from a food photo?",
      a: (
        <>
          Upload a clear photo of your meal and the model estimates total calories from visible
          portion size, ingredients, and common preparation methods. It is an estimate, not a lab
          measurement, so image quality and portion visibility matter.
        </>
      ),
    },
    {
      q: "What kind of photos give the best calorie estimate?",
      a: (
        <>
          Use bright, sharp photos where the full plate is visible. Avoid heavy filters, dark
          lighting, and extreme camera angles. For better consistency, take photos from a similar
          distance each time.
        </>
      ),
    },
    {
      q: "How accurate is the AI calorie estimate?",
      a: (
        <>
          Accuracy is usually directional, not exact. It is useful for tracking trends and making
          better daily decisions, but it should not replace nutrition labels, food scales, or
          medical nutrition guidance when precision is required.
        </>
      ),
    },
    {
      q: "How To Improve Accuracy",
      a: (
        <>
          <ul className="list-disc space-y-2 pl-6">
            <li>Shoot from top-down or 45-degree angle with the full plate visible.</li>
            <li>Avoid heavy shadows and keep lighting bright and even.</li>
            <li>Include all sides, sauces, and drinks in the frame.</li>
            <li>Use one clear image per meal without clutter from other plates.</li>
            <li>Retake if ingredients are stacked or hidden by toppings.</li>
          </ul>
        </>
      ),
    },
    {
      q: "Can it estimate calories for mixed meals like bowls, casseroles, or takeout?",
      a: (
        <>
          Yes, but mixed meals are harder than single-item foods because ingredients can be hidden.
          The tool still provides a best estimate based on visible cues and common serving patterns.
        </>
      ),
    },
    {
      q: "Does the result include protein, carbs, and fat?",
      a: (
        <>
          Yes. The results card provides an estimated macro breakdown in grams for protein, carbs,
          and fat, plus macro percentages to help you quickly understand meal composition.
        </>
      ),
    },
    {
      q: "What does the meal classification mean (for example, healthy or snack)?",
      a: (
        <>
          Classification is a quick, high-level label based on the estimated energy density and
          macro balance of the meal. It is informational only and should not be treated as medical
          advice.
        </>
      ),
    },
    {
      q: "Why do I get different calorie results for similar photos?",
      a: (
        <>
          Small changes in photo angle, lighting, hidden ingredients, and plate size can shift the
          estimate. Keep photo conditions consistent to improve repeatability.
        </>
      ),
    },
    {
      q: "Can I use this for drinks, smoothies, and coffee beverages?",
      a: (
        <>
          Yes, but drinks can be harder when ingredients are not visible. Results are most useful
          when you also include context such as cup size and known add-ins when possible.
        </>
      ),
    },
    {
      q: "Can I use AI Calorie Counter for daily calorie tracking?",
      a: (
        <>
          Yes. Many users use it as a fast logging aid. It works best as part of a routine where
          you compare totals across days and weeks instead of obsessing over one meal estimate.
        </>
      ),
    },
    {
      q: "Is AI Calorie Counter free to use?",
      a: (
        <>
          Yes. AI Calorie Counter offers a free online experience so you can upload a meal photo
          and get a calorie estimate quickly.
        </>
      ),
    },
    {
      q: "Do you store or sell my uploaded food photos?",
      a: (
        <>
          We process images to generate results and aim to minimize retention. Uploaded content is
          not sold. For details, review the privacy page and terms.
        </>
      ),
    },
    {
      q: "Can this replace advice from a doctor or registered dietitian?",
      a: (
        <>
          No. This tool is for informational and educational use. If you have medical conditions,
          dietary restrictions, or performance-specific goals, work with a qualified professional.
        </>
      ),
    },
    {
      q: "What references are used for calorie and serving context?",
      a: (
        <>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              USDA FoodData Central (nutrient and calorie database):{" "}
              <a
                href="https://fdc.nal.usda.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                USDA FoodData Central
              </a>
            </li>
            <li>
              FDA reference guide for serving sizes and labels:{" "}
              <a
                href="https://www.fda.gov/food/nutrition-facts-label"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                FDA Nutrition Facts Label
              </a>
            </li>
            <li>
              NIH body weight planner context for intake/expenditure:{" "}
              <a
                href="https://www.niddk.nih.gov/bwp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                NIDDK Body Weight Planner
              </a>
            </li>
          </ul>
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
      description="Answers to common questions about estimating calories from food photos with AI."
      items={FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))}
      className="mt-0"
    />
  );
}

// app/components/FaqJsonLd.tsx
import Script from "next/script";

type FAQItem = {
  question: string;
  answer: string;
};

function normalizeFaqs(faqs: FAQItem[]) {
  const seen = new Set<string>();
  const cleaned = faqs
    .map((faq) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }))
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0)
    .filter((faq) => {
      const key = faq.question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return cleaned.slice(0, 8);
}

export default function FaqJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const normalizedFaqs = normalizeFaqs(faqs);
  if (normalizedFaqs.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalizedFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

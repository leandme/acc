export function AuthorSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Matt Phelps",
          "url": "https://ai-calorie-counter.com",
          "sameAs": [
            "https://www.linkedin.com/in/matt-phelps/",
            "https://www.youtube.com/@mgphelps"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "AI Calorie Counter",
            "url": "https://ai-calorie-counter.com"
          }
        })
      }}
    />
  );
}

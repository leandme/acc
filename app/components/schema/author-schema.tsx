export function AuthorSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Matt Phelps",
          "url": "https://bodyfatestimator.ai",
          "sameAs": [
            "https://www.linkedin.com/in/matt-phelps/",
            "https://www.youtube.com/@mgphelps"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "BodyFatEstimator.ai",
            "url": "https://bodyfatestimator.ai"
          }
        })
      }}
    />
  );
}

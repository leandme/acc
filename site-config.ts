export const siteConfig = {
  // SITE
site: {
    name: "Body Fat Estimator",
    url: "https://bodyfatestimator.ai",
    tagline: "Calculate your body fat % from a photo with AI.",
    domain: "bodyfatestimator.ai",
    legalName: "BodyFatEstimator.ai",
    logo: "/logo.png",
  },

  // FOUNDER
  founder: {
    name: "Matt Phelps",
    email: "matt@leandme.com",
    image: "/profile/matt-phelps-headshot.webp",
    bio:
      "Independent product builder focused on practical fitness tools, body composition, and visual progress tracking.",
    social: {
      linkedin: "https://www.linkedin.com/in/matt-phelps/",
      youtube: "https://www.youtube.com/@mgphelps",
    },
  },

   // ESTIMATE
estimate: {
    totalCount: "120,655",
  },

// PAYMENT
payment: {
    singleEstimatePaymentLink:"https://buy.stripe.com/9B63cvcKneJP1Hlg5afAc0e",
    progressPackPaymentLink:"https://buy.stripe.com/28E5kDh0D3175XBf16fAc0f",
    lifetimePaymentLink:"https://buy.stripe.com/14AdR94dRbxDgCf4msfAc0g"
    
}
} as const;

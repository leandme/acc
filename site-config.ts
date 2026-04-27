export const siteConfig = {
  // SITE
site: {
    name: "AI Calorie Counter",
    url: "https://ai-calorie-counter.com",
    tagline: "Your calorie tracking companion that helps you understand what you eat. Scan meals, track macros, count calories and spot patterns that shape your eating habits and fitness goals.",
    domain: "ai-calorie-counter.com",
    legalName: "AI Calorie Counter",
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

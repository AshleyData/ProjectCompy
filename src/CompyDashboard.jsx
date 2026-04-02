import { useState } from "react";

const WEEK = "2026-03-30";

const DATA = {
  gsc: {
    clicks: 3481, impressions: 114423, ctr: 3.04, avg_position: 9.1,
    clicks_last: 3418, impressions_last: 0,
    wow_clicks: 0.5, wow_impressions: 10.2,
    trailing_28d_clicks: 14594, mom_clicks: -0.9,
    branded: 1889, nonbranded: 251, anonymized: 1341,
  },
  exec_summary: [
    "GrowthBook's organic click volume was essentially flat this week at 3,481 clicks (+0.5% WoW), while impressions grew to 114,423 (+10.2% WoW) \u2014 a meaningful divergence suggesting broader visibility without a proportional increase in click-throughs. CTR dipped from 3.34% to 3.04%, and average position improved from 9.56 to 9.10. The homepage remains the dominant source of clicks at 1,788, down 32 from the prior week, likely normal branded fluctuation. Bright spots: /products/experiments (+6 clicks), GrowthBook vs Statsig compare page (+4 clicks), and the A/B testing blog post (+5 clicks).",
    "The highest-priority opportunities this week come from LaunchDarkly and Statsig ranking for high-intent experimentation queries \u2014 'A/B rollouts,' 'A/B split test,' and 'A/B split testing' \u2014 where GrowthBook has weak or no coverage. These are mid-funnel queries from buyers actively evaluating tools. LaunchDarkly also published a new 'Experimentation' platform page (threat 8/10, KD 15) and a 'Platform Overview' demo page. Amplitude published a comparison page targeting 'LaunchDarkly' (threat 8/10, KD 22), further building its comparison content moat.",
    "Competitor content volume this week: 246 new pages detected across all sitemaps, 46 high-threat (7+/10). Harness continues its 'Explained in 60 Seconds' YouTube series \u2014 'What is Load Testing?' ran at 6.5\u00d7 channel average (839 views). GrowthBook's top YouTube outlier 'Faster Shipping Means You Need Testing More' holds at 5.9\u00d7 average with 1,336 views \u2014 the strongest performing video in the entire tracked set this week.",
  ],
  opportunities: [
    { rank: 1, topic: "A/B Rollouts", competitor: "LaunchDarkly", score: 83.9, kd: "n/a", bucket: "Quick Win", url: "https://launchdarkly.com/blog/mobile-app-ab-testing/", why: "LaunchDarkly ranks for this query while GrowthBook has weak or no coverage. Score 83.9 = blend of KD, domain authority, and topic relevance." },
    { rank: 2, topic: "Ab Split Test", competitor: "Statsig", score: 83.4, kd: "n/a", bucket: "Quick Win", url: "https://www.statsig.com/perspectives/ab-testing-vs-split-testing", why: "Statsig ranks for this query while GrowthBook has weak or no coverage. Score 83.4 = blend of KD, domain authority, and topic relevance." },
    { rank: 3, topic: "A/B Split Testing", competitor: "Optimizely", score: 83.2, kd: "n/a", bucket: "Quick Win", url: "https://www.optimizely.com/optimization-glossary/ab-testing/", why: "Optimizely ranks for this query while GrowthBook has weak or no coverage. Score 83.2 = blend of KD, domain authority, and topic relevance." },
    { rank: 4, topic: "Multi Bandit", competitor: "LaunchDarkly", score: 82.8, kd: "n/a", bucket: "Quick Win", url: "https://launchdarkly.com/docs/home/multi-armed-bandits", why: "LaunchDarkly ranks for this query while GrowthBook has weak or no coverage. Score 82.8 = blend of KD, domain authority, and topic relevance." },
    { rank: 5, topic: "Power Calculation And Sample Size", competitor: "Amplitude Exp", score: 80.3, kd: "n/a", bucket: "Quick Win", url: "https://amplitude.com/explore/experiment/power-analysis", why: "Amplitude Exp ranks for this query while GrowthBook has weak or no coverage. Score 80.3 = blend of KD, domain authority, and topic relevance." },
  ],
  top_movers: {
    gains: [
      { url: "growthbook.io/products/experiments", clicks: 16, prior: 10, change: 6 },
      { url: "blog.growthbook.io/what-is-a-b-testing/", clicks: 6, prior: 1, change: 5 },
      { url: "growthbook.io/compare/growthbook-vs-statsig", clicks: 5, prior: 1, change: 4 },
      { url: "blog.growthbook.io/guide-to-multi-arm-bandits-what-is-it-and-why-you-probably-shouldnt-use-it/", clicks: 5, prior: 1, change: 4 },
    ],
    declines: [
      { url: "growthbook.io/", clicks: 1788, prior: 1820, change: -32 },
      { url: "growthbook.io/customers/khan-academy", clicks: 1, prior: 6, change: -5 },
      { url: "blog.growthbook.io/how-to-a-b-test-ai-a-practical-guide/", clicks: 3, prior: 7, change: -4 },
      { url: "blog.growthbook.io/release-4-3-faster-experiments/", clicks: 2, prior: 5, change: -3 },
      { url: "blog.growthbook.io/", clicks: 5, prior: 8, change: -3 },
    ],
  },
  striking_distance: [
    { query: "ab testing software", position: 8.1, impressions: 867, clicks: 0, opportunity: "High" },
    { query: "what is a/b testing", position: 15.7, impressions: 700, clicks: 1, opportunity: "Medium" },
    { query: "ab testing tools", position: 13.5, impressions: 654, clicks: 1, opportunity: "Medium" },
    { query: "a/b testing tools", position: 13.0, impressions: 636, clicks: 0, opportunity: "Medium" },
    { query: "betterme engineering process feature flags experiments", position: 9.1, impressions: 582, clicks: 0, opportunity: "High" },
    { query: "ab testing tool", position: 11.1, impressions: 575, clicks: 1, opportunity: "High" },
    { query: "launchdarkly alternatives", position: 11.2, impressions: 568, clicks: 0, opportunity: "High" },
    { query: "what is feature flagging", position: 9.7, impressions: 456, clicks: 0, opportunity: "High" },
  ],
  competitors: [
    { name: "Optimizely", etv: 529425, pages: 79, top_page: "What is A/B testing? With examples", top_etv: 250189 },
    { name: "Statsig", etv: 243452, pages: 106, top_page: "What is an experimental control?", top_etv: 45481 },
    { name: "Amplitude Exp", etv: 296499, pages: 82, top_page: "Correlation vs Causation: Learn the Difference", top_etv: 123936 },
    { name: "Harness", etv: 187420, pages: 106, top_page: "What is A/B Testing?", top_etv: 92684 },
    { name: "LaunchDarkly", etv: 21183, pages: 120, top_page: "A Comprehensive Guide to Smoke Testing in Software ...", top_etv: 4949 },
    { name: "Eppo", etv: 11482, pages: 39, top_page: "A/B testing vs. split testing: Which should you use?", top_etv: 4211 },
    { name: "PostHog", etv: 10678, pages: 135, top_page: "Product engineer vs software engineer: How are they ...", top_etv: 898 },
    { name: "Unleash", etv: 3375, pages: 15, top_page: "How To Implement Trunk-Based Development", top_etv: 2080 },
    { name: "Flagsmith", etv: 1091, pages: 18, top_page: "What is Canary Deployment? When and How To Use It", top_etv: 258 },
    { name: "GrowthBook", etv: 186, pages: 8, top_page: "What is A/B Testing? The Complete Guide to Data-Driven ...", top_etv: 50, note: "ETV underreports \u2014 GSC shows ~9,700 clicks/mo. 45% is branded search." },
  ],
  new_content: [
    { competitor: "LaunchDarkly", slug: "experimentation", url: "https://launchdarkly.com/platform/experimentation", threat: 8, kd: 15, date: "2026-03-25" },
    { competitor: "LaunchDarkly", slug: "platform overview", url: "https://launchdarkly.com/product-demo/platform-overview", threat: 8, kd: 11, date: "" },
    { competitor: "Amplitude Exp", slug: "launchdarkly", url: "https://amplitude.com/compare/launchdarkly", threat: 8, kd: 22, date: "2026-03-16" },
    { competitor: "LaunchDarkly", slug: "feature flags", url: "https://launchdarkly.com/platform/feature-flags", threat: 7, kd: 38, date: "2026-03-25" },
    { competitor: "Optimizely", slug: "cortland management", url: "https://www.optimizely.com/insights/cortland-management", threat: 7, kd: "n/a", date: "2026-03-26" },
    { competitor: "Optimizely", slug: "experience optimization", url: "https://www.optimizely.com/solutions/experience-optimization", threat: 7, kd: "n/a", date: "2026-03-02" },
    { competitor: "Harness", slug: "application security testing", url: "https://www.harness.io/products/application-security-testing", threat: 7, kd: 17, date: "" },
    { competitor: "Harness", slug: "cloud cost management", url: "https://www.harness.io/products/cloud-cost-management", threat: 7, kd: 28, date: "" },
    { competitor: "Harness", slug: "ci cloud", url: "https://www.harness.io/products/continuous-integration/ci-cloud", threat: 7, kd: 29, date: "" },
    { competitor: "Harness", slug: "api testing", url: "https://www.harness.io/products/web-application-and-api-protection/api-testing", threat: 7, kd: 25, date: "" },
    { competitor: "Amplitude Exp", slug: "custom pr agent", url: "https://amplitude.com/blog/custom-pr-agent", threat: 7, kd: "n/a", date: "2026-03-27" },
    { competitor: "Amplitude Exp", slug: "fast company 2026", url: "https://amplitude.com/blog/fast-company-2026", threat: 7, kd: "n/a", date: "2026-03-24" },
    { competitor: "Amplitude Exp", slug: "healthcare ai", url: "https://amplitude.com/blog/healthcare-ai", threat: 7, kd: "n/a", date: "2026-03-25" },
    { competitor: "Amplitude Exp", slug: "engineering", url: "https://amplitude.com/blog/tag/engineering", threat: 7, kd: "n/a", date: "2026-03-26" },
    { competitor: "Amplitude Exp", slug: "adobe", url: "https://amplitude.com/compare/adobe", threat: 7, kd: "n/a", date: "2026-03-16" },
  ],
  etv_kd: [
    { competitor: "Optimizely", title: "What is A/B testing? With examples", url: "www.optimizely.com/optimization-glossary/ab-testing/", etv: 250189, kd: 63 },
    { competitor: "Amplitude Exp", title: "Correlation vs Causation: Learn the Difference", url: "amplitude.com/blog/causation-correlation", etv: 123936, kd: 23 },
    { competitor: "Harness", title: "What is A/B Testing?", url: "www.harness.io/harness-devops-academy/ab-testing", etv: 92684, kd: 63 },
    { competitor: "Optimizely", title: "What is conversion rate optimization (CRO)?", url: "www.optimizely.com/optimization-glossary/conversion-rate-optimization/", etv: 68802, kd: 32 },
    { competitor: "Optimizely", title: "What is a unique selling point (USP)? With examples", url: "www.optimizely.com/optimization-glossary/unique-selling-point/", etv: 44182, kd: 42 },
    { competitor: "Amplitude Exp", title: "What is a T-test? How to Use and Interpret T-test Results", url: "amplitude.com/explore/experiment/t-test", etv: 34219, kd: 26 },
    { competitor: "Optimizely", title: "What is commerce?", url: "www.optimizely.com/optimization-glossary/commerce/", etv: 19821, kd: 82 },
    { competitor: "Amplitude Exp", title: "P Values: What They Are and How to Calculate Them", url: "amplitude.com/explore/experiment/p-values", etv: 17585, kd: 26 },
    { competitor: "Harness", title: "The Seven Phases of the Software Development Life Cycle", url: "www.harness.io/blog/software-development-life-cycle-phases", etv: 16729, kd: 45 },
    { competitor: "Optimizely", title: "What is search engine optimization (SEO)?", url: "www.optimizely.com/optimization-glossary/search-engine-optimization/", etv: 14069, kd: 74 },
    { competitor: "Amplitude Exp", title: "Understanding Confidence Intervals and How to Calculate ...", url: "amplitude.com/explore/experiment/confidence-intervals", etv: 13907, kd: 42 },
    { competitor: "Optimizely", title: "What is a call-to-action (CTA)?", url: "www.optimizely.com/optimization-glossary/call-to-action/", etv: 13773, kd: 73 },
    { competitor: "Optimizely", title: "What is search engine marketing (SEM)?", url: "www.optimizely.com/optimization-glossary/search-engine-marketing/", etv: 13619, kd: 52 },
    { competitor: "Optimizely", title: "What is a content management system (CMS)?", url: "www.optimizely.com/optimization-glossary/content-management-system/", etv: 13211, kd: 48 },
    { competitor: "Amplitude Exp", title: "What Exponential Growth Really Looks Like (And How to ...", url: "amplitude.com/blog/exponential-growth", etv: 11828, kd: 30 },
    { competitor: "Optimizely", title: "What is lead generation?", url: "www.optimizely.com/optimization-glossary/lead-generation/", etv: 11186, kd: 82 },
    { competitor: "Optimizely", title: "What is trunk-based development?", url: "www.optimizely.com/optimization-glossary/trunk-based-development/", etv: 10740, kd: 21 },
    { competitor: "Amplitude Exp", title: "Amplitude", url: "amplitude.com/docs/sdks/ampli", etv: 10062, kd: 11 },
    { competitor: "Optimizely", title: "What is a heatmap? benefits, limitations and examples", url: "www.optimizely.com/optimization-glossary/heatmap/", etv: 5718, kd: 70 },
    { competitor: "Amplitude Exp", title: "What is Amplitude?", url: "amplitude.com/docs/get-started/what-is-amplitude", etv: 5502, kd: 20 },
    { competitor: "Optimizely", title: "What is an ecommerce platform?", url: "www.optimizely.com/optimization-glossary/ecommerce-platform/", etv: 4711, kd: 42 },
    { competitor: "Statsig", title: "90% vs. 95% confidence interval: which to use?", url: "www.statsig.com/perspectives/confidence-interval-90-vs-95", etv: 4434, kd: 9 },
    { competitor: "Optimizely", title: "What is a null hypothesis?", url: "www.optimizely.com/optimization-glossary/null-hypothesis/", etv: 4388, kd: 8 },
    { competitor: "Harness", title: "What is Trunk-Based Development?", url: "www.harness.io/harness-devops-academy/trunk-based-development", etv: 4341, kd: 21 },
    { competitor: "Amplitude Exp", title: "What Are Data Types and Why Are They Important?", url: "amplitude.com/blog/data-types", etv: 4289, kd: 37 },
    { competitor: "Eppo", title: "A/B testing vs. split testing: Which should you use?", url: "www.geteppo.com/blog/ab-testing-vs-split-testing", etv: 4211, kd: 21 },
    { competitor: "Optimizely", title: "What is average order value (AOV)?", url: "www.optimizely.com/optimization-glossary/average-order-value/", etv: 4039, kd: 21 },
    { competitor: "Statsig", title: "A/B testing vs. split testing: is there a difference?", url: "www.statsig.com/perspectives/ab-testing-vs-split-testing", etv: 3551, kd: 21 },
    { competitor: "Statsig", title: "Understanding the role of the 95% confidence interval", url: "www.statsig.com/blog/95-percent-confidence-interval", etv: 2941, kd: 19 },
    { competitor: "Optimizely", title: "What is lifetime value (LTV)?", url: "www.optimizely.com/optimization-glossary/lifetime-value/", etv: 2707, kd: 53 },
  ],
  youtube: {
    channels: [
      { name: "Optimizely", avg_views: 97, video_count: 20, no_recent: false, videos: [
        { title: "4 signals AI uses to decide what content to cite", views: 10, mult: 0.1, date: "2026-03-27", url: "https://www.youtube.com/watch?v=pRKg4f5R3xA", is_outlier: false },
        { title: "AI helps run 90% of this marketing team", views: 136, mult: 1.4, date: "2026-03-26", url: "https://www.youtube.com/watch?v=yG8FnM3gdcE", is_outlier: false },
        { title: "How Diligent routes all marketing through one AI system (Control Watchtower)", views: 29, mult: 0.3, date: "2026-03-26", url: "https://www.youtube.com/watch?v=d7w-UKI4nxA", is_outlier: false },
        { title: "Most people get vertical AI wrong", views: 109, mult: 1.1, date: "2026-03-25", url: "https://www.youtube.com/watch?v=SYPhVeeeZ6I", is_outlier: false },
        { title: "Vertical AI vs horizontal AI: which wins?", views: 34, mult: 0.4, date: "2026-03-25", url: "https://www.youtube.com/watch?v=v80G1_CK08E", is_outlier: false },
        { title: "Worse content is winning in AI search\u2026 here\u2019s why", views: 231, mult: 2.4, date: "2026-03-24", url: "https://www.youtube.com/watch?v=RKOV2O3tnp8", is_outlier: true },
        { title: "How AI search decides who to cite | 4 signals explained", views: 63, mult: 0.6, date: "2026-03-23", url: "https://www.youtube.com/watch?v=JPdcO-20Qi4", is_outlier: false },
      ]},
      { name: "Statsig", avg_views: 127, video_count: 4, no_recent: false, videos: [
        { title: "Advanced methods for faster experimentation", views: 303, mult: 2.4, date: "2026-01-29", url: "https://www.youtube.com/watch?v=uxV0teHXBjA", is_outlier: true },
        { title: "NextDoor x Statsig Customer Story", views: 49, mult: 0.4, date: "2026-01-26", url: "https://www.youtube.com/watch?v=TlAg-_LjEOc", is_outlier: false },
        { title: "Brex x Statsig Customer Story", views: 89, mult: 0.7, date: "2026-01-12", url: "https://www.youtube.com/watch?v=EZcplcvRJxU", is_outlier: false },
        { title: "Life360 x Statsig Customer Story", views: 67, mult: 0.5, date: "2026-01-09", url: "https://www.youtube.com/watch?v=-d0AHF_LGis", is_outlier: false },
      ]},
      { name: "Amplitude Exp", avg_views: 104, video_count: 20, no_recent: false, videos: [
        { title: "Agent Analytics: Inside the Black Box | Amplitude AI", views: 169, mult: 1.6, date: "2026-03-19", url: "https://www.youtube.com/watch?v=w79kHtcp5Kw", is_outlier: false },
        { title: "Primary vs Guardrail Metrics Explained", views: 49, mult: 0.5, date: "2026-03-13", url: "https://www.youtube.com/watch?v=rdXdHJyEcJw", is_outlier: false },
        { title: "Amplitude AI: Your unfair advantage", views: 156, mult: 1.5, date: "2026-03-12", url: "https://www.youtube.com/watch?v=dA2bfWPK2Bs", is_outlier: false },
        { title: "How to Find Every Event Triggered in Your Account", views: 27, mult: 0.3, date: "2026-03-12", url: "https://www.youtube.com/watch?v=WIdnuoirU9I", is_outlier: false },
        { title: "Meet Amplitude AI Assistant: Use Behavioral Context to Personalize Customer Chats", views: 145, mult: 1.4, date: "2026-03-11", url: "https://www.youtube.com/watch?v=07H02hQJpME", is_outlier: false },
        { title: "How to Build Mobile Guides and Surveys | Amplitude for Product Teams", views: 56, mult: 0.5, date: "2026-03-11", url: "https://www.youtube.com/watch?v=gCOgG4bckRY", is_outlier: false },
        { title: "How to Trace Analytics Events Back to the UI", views: 31, mult: 0.3, date: "2026-03-11", url: "https://www.youtube.com/watch?v=v4EOqqoeVfM", is_outlier: false },
      ]},
      { name: "Harness", avg_views: 129, video_count: 20, no_recent: false, videos: [
        { title: "What is Disaster Recovery Testing? Explained in 60 seconds | Resilience Testing | Harness", views: 332, mult: 2.6, date: "2026-03-27", url: "https://www.youtube.com/watch?v=Airf_IXxiEA", is_outlier: true },
        { title: "Women\u2019s Day Panel: Navigating the Future of Engineering in the Age of AI", views: 17, mult: 0.1, date: "2026-03-26", url: "https://www.youtube.com/watch?v=lrppkBV7qu8", is_outlier: false },
        { title: "Secure AI Coding with Harness SAST & SCA on Cursor", views: 33, mult: 0.3, date: "2026-03-26", url: "https://www.youtube.com/watch?v=LXSEv5X47lw", is_outlier: false },
        { title: "Secure AI Coding with Harness SAST & SCA on Windsurf", views: 100, mult: 0.8, date: "2026-03-26", url: "https://www.youtube.com/watch?v=GyJjNKvwgpA", is_outlier: false },
        { title: "What is Load Testing? Explained in 60 Seconds | Resilience Testing | 2026 | Harness", views: 839, mult: 6.5, date: "2026-03-25", url: "https://www.youtube.com/watch?v=FnbyQBGigpg", is_outlier: true },
        { title: "Rolling Deployments Explained: Seamless Software Delivery", views: 52, mult: 0.4, date: "2026-03-24", url: "https://www.youtube.com/watch?v=VPm5GW_O1Pg", is_outlier: false },
        { title: "Harness AI for Argo CD", views: 67, mult: 0.5, date: "2026-03-20", url: "https://www.youtube.com/watch?v=yWN7pFE1xQY", is_outlier: false },
      ]},
      { name: "LaunchDarkly", avg_views: 80, video_count: 20, no_recent: false, videos: [
        { title: "Control Your Multi-Agent System with LaunchDarkly Agent Graphs", views: 31, mult: 0.4, date: "2026-03-27", url: "https://www.youtube.com/watch?v=XBIpTwb_KC4", is_outlier: false },
        { title: "InFocus - Honeycomb: Post-Merge Control #LaunchDarkly #FeatureFlags #DevOps", views: 78, mult: 1.0, date: "2026-03-26", url: "https://www.youtube.com/watch?v=tok0ONzyDFY", is_outlier: false },
        { title: "InFocus - Honeycomb: Accept Code is Never Going to Be Perfect #LaunchDarkly #DevOps #FeatureFlags", views: 15, mult: 0.2, date: "2026-03-24", url: "https://www.youtube.com/watch?v=1NwdWpSBlNg", is_outlier: false },
        { title: "InFocus - Honeycomb: Confidence to Code with AI #LaunchDarkly #FeatureFlags #DevOps #AIDevelopment", views: 95, mult: 1.2, date: "2026-03-19", url: "https://www.youtube.com/watch?v=eReqg-mAo7Y", is_outlier: false },
        { title: "InFocus - Honeycomb: Granular Control #LaunchDarkly #FeatureFlags #SoftwareDelivery #AIDevelopment", views: 92, mult: 1.1, date: "2026-03-17", url: "https://www.youtube.com/watch?v=vlc-DOjibQM", is_outlier: false },
        { title: "InFocus - Poka: Flagging not so violent content #LaunchDarkly #AIConfigs #FeatureFlags #DevTools", views: 67, mult: 0.8, date: "2026-03-16", url: "https://www.youtube.com/watch?v=HNax8V-eBU8", is_outlier: false },
        { title: "Data Points #LaunchDarkly #AIDevelopment #FeatureFlags #AIConfigs  #ContinuousDelivery #AIGovernance", views: 78, mult: 1.0, date: "2026-03-13", url: "https://www.youtube.com/watch?v=i_pqhVKGAyI", is_outlier: false },
      ]},
      { name: "Eppo", avg_views: 0, video_count: 0, no_recent: false, videos: [
      ]},
      { name: "PostHog", avg_views: 847, video_count: 20, no_recent: false, videos: [
        { title: "PostHog: The Documentary (Full Version)", views: 727, mult: 0.9, date: "2026-03-23", url: "https://www.youtube.com/watch?v=dGaSxBs3OsU", is_outlier: false },
        { title: "Automatically group LLM traces by behavior \u2014 PostHog Clusters Demo", views: 450, mult: 0.5, date: "2026-03-11", url: "https://www.youtube.com/watch?v=OlOMc70-k8A", is_outlier: false },
        { title: "Using PostHog AI to investigate traffic spikes \u2013\u00a0PostHog AI Tutorial", views: 299, mult: 0.4, date: "2026-03-04", url: "https://www.youtube.com/watch?v=06uDklPgObw", is_outlier: false },
        { title: "Steve the Horse presents: PostHog Logs #posthog #changelog", views: 216, mult: 0.3, date: "2026-03-04", url: "https://www.youtube.com/watch?v=rO1MOgi1xNE", is_outlier: false },
        { title: "How to use the PostHog MCP in v0 by Vercel (Feature Flags & A/B Testing)", views: 432, mult: 0.5, date: "2026-02-25", url: "https://www.youtube.com/watch?v=l7IXtdDZCYA", is_outlier: false },
        { title: "You can build ANYTHING", views: 566, mult: 0.7, date: "2026-02-20", url: "https://www.youtube.com/watch?v=wzdaDqZ3HI0", is_outlier: false },
        { title: "Introducing Logs by PostHog", views: 2084, mult: 2.5, date: "2026-02-19", url: "https://www.youtube.com/watch?v=e_SICQg2Wak", is_outlier: true },
      ]},
      { name: "Unleash", avg_views: 178, video_count: 2, no_recent: false, videos: [
        { title: "Live Webinar: Designing for Failure and Speed in Agentic AI Workflows with FeatureOps", views: 233, mult: 1.3, date: "2026-02-24", url: "https://www.youtube.com/watch?v=cA0aCzV0MMY", is_outlier: false },
        { title: "FeatureOps as Strategy: Governing Hyper-Growth at Lloyds", views: 122, mult: 0.7, date: "2026-01-19", url: "https://www.youtube.com/watch?v=4dT3gUYvE0c", is_outlier: false },
      ]},
      { name: "Flagsmith", avg_views: 45, video_count: 3, no_recent: false, videos: [
        { title: "Releasing in the AI Era: How Feature Flags Keep You in Control", views: 1, mult: 0.0, date: "2026-03-29", url: "https://www.youtube.com/watch?v=kkWz3GJeALs", is_outlier: false },
        { title: "Feature Flag Cleanup at Scale: How to Eliminate Technical Debt with AI (MCP Explained)", views: 73, mult: 1.6, date: "2026-03-19", url: "https://www.youtube.com/watch?v=CYBBpLdAavo", is_outlier: false },
        { title: "Feature Flags: A Safety Net in the AI Era", views: 62, mult: 1.4, date: "2026-01-28", url: "https://www.youtube.com/watch?v=6D4gtW7XrTI", is_outlier: false },
      ]},
      { name: "GrowthBook", avg_views: 225, video_count: 20, no_recent: false, videos: [
        { title: "Test Your AI Changes. Every Single One.", views: 269, mult: 1.2, date: "2026-03-27", url: "https://www.youtube.com/watch?v=4-iSPAnz5ag", is_outlier: false },
        { title: "From MVP to MVT: LinkedIn and Intuit\u2019s Playbook for Experimentation Everywhere", views: 13, mult: 0.1, date: "2026-03-26", url: "https://www.youtube.com/watch?v=xYjaTbaW9jI", is_outlier: false },
        { title: "Unit Tests Can't Save Your AI App", views: 207, mult: 0.9, date: "2026-03-26", url: "https://www.youtube.com/watch?v=4gRxN8fpDb8", is_outlier: false },
        { title: "Faster Shipping Means You Need Testing More", views: 1336, mult: 5.9, date: "2026-03-23", url: "https://www.youtube.com/watch?v=uKeE193-ZR0", is_outlier: true },
        { title: "Shipping Faster, Safely: Truist\u2019s SVP on AI, Developer Experience, and Human-in-the-Loop Banking", views: 49, mult: 0.2, date: "2026-03-18", url: "https://www.youtube.com/watch?v=Zp2ly3a4vBQ", is_outlier: false },
        { title: "Microsoft\u2019s Marco Casalaina on Evals, Go\u2011Live Metrics & Copilot Velocity", views: 42, mult: 0.2, date: "2026-03-17", url: "https://www.youtube.com/watch?v=-qhUICzf7w4", is_outlier: false },
        { title: "High Engagement Can Be a Red Flag", views: 209, mult: 0.9, date: "2026-03-12", url: "https://www.youtube.com/watch?v=vxrrg-K9oVE", is_outlier: false },
      ]},
    ],
  },
};

const C = {
  primary: "#1B4F72", accent: "#2E86C1", success: "#1E8449",
  warning: "#D4AC0D", danger: "#C0392B", muted: "#6C757D",
  white: "#FFFFFF", border: "#DEE2E6", bg: "#F0F2F5",
};
const COMP_COLORS = {
  Optimizely: "#6C3483", "Amplitude Exp": "#2874A6", Statsig: "#1ABC9C",
  Harness: "#D35400", LaunchDarkly: "#2C3E50", Eppo: "#E74C3C",
  PostHog: "#F39C12", Unleash: "#16A085", Flagsmith: "#8E44AD", GrowthBook: "#1E8449",
};

function card(extra = {}) {
  return { background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, ...extra };
}

function MetricCard({ label, value, change, sub }) {
  const color = change > 0 ? C.success : change < 0 ? C.danger : C.muted;
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "";
  return (
    <div style={{ ...card({ padding: "16px 20px", flex: 1, minWidth: 150 }) }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.primary, margin: "4px 0 2px" }}>{value}</div>
      {change !== undefined && <div style={{ fontSize: 13, color }}>{arrow} {Math.abs(change)}% WoW</div>}
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Bar({ label, value, max, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div style={{ width: 130, fontSize: 13, textAlign: "right", color: C.muted, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ flex: 1, background: "#EBF5FB", borderRadius: 4, height: 22 }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", borderRadius: 4, background: color || C.accent, minWidth: 3 }} />
      </div>
      <div style={{ width: 75, fontSize: 13, fontWeight: 600, color: C.primary }}>{value.toLocaleString()}</div>
    </div>
  );
}

function Table({ headers, rows, compact }) {
  const p = compact ? "5px 8px" : "8px 12px";
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compact ? 12 : 13 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ padding: p, textAlign: "left", background: C.primary, color: C.white, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.white : "#F8F9FA" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: p, borderBottom: `1px solid ${C.border}` }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.primary, borderBottom: `2px solid ${C.accent}`, paddingBottom: 6, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function BucketBadge({ bucket }) {
  const bg = bucket === "Quick Win" ? C.success : bucket === "Content Gap" ? C.warning : C.danger;
  return <span style={{ background: bg, color: C.white, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{bucket}</span>;
}

function OpportunityBadge({ opp }) {
  const bg = opp === "High" ? C.danger : opp === "Medium" ? C.warning : C.muted;
  return <span style={{ background: bg, color: C.white, padding: "2px 6px", borderRadius: 8, fontSize: 11 }}>{opp}</span>;
}

const TABS = [
  { id: "summary", label: "📊 Summary" },
  { id: "opportunities", label: "🎯 Opportunities" },
  { id: "competitors", label: "🏁 Competitors" },
  { id: "gsc", label: "📈 GSC Detail" },
  { id: "youtube", label: "▶️ YouTube" },
  { id: "content", label: "🆕 New Content" },
  { id: "etv_kd", label: "📉 ETV vs KD" },
];

export default function CompyDashboard() {
  const [tab, setTab] = useState("summary");
  const d = DATA;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700 }}>🔍 Compy Weekly Brief</div>
          <div style={{ color: "#AED6F1", fontSize: 12 }}>GrowthBook Competitive Intelligence · Week of {WEEK}</div>
        </div>
        <div style={{ color: "#AED6F1", fontSize: 12, textAlign: "right" }}>
          GSC: 3,481 clicks · +0.5% WoW<br />
          114K impressions · +10.2% WoW
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13,
            fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, whiteSpace: "nowrap",
            borderBottom: tab === t.id ? `3px solid ${C.accent}` : "3px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── SUMMARY ── */}
        {tab === "summary" && (<>
          {/* Scorecard row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <MetricCard label="Clicks" value={d.gsc.clicks.toLocaleString()} change={d.gsc.wow_clicks} sub={`${d.gsc.clicks_last.toLocaleString()} prior week`} />
            <MetricCard label="Impressions" value={`${Math.round(d.gsc.impressions/1000)}K`} change={d.gsc.wow_impressions} sub="prior week" />
            <MetricCard label="CTR" value={`${d.gsc.ctr.toFixed(2)}%`} sub="WoW" />
            <MetricCard label="Avg Position" value={d.gsc.avg_position} sub="WoW" />
            <MetricCard label="28-Day Clicks" value={d.gsc.trailing_28d_clicks.toLocaleString()} sub={`${d.gsc.mom_clicks > 0 ? "+" : ""}${d.gsc.mom_clicks}% MoM`} />
          </div>

          {/* Click breakdown */}
          <Section title="Click Breakdown (This Week)">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Branded", value: d.gsc.branded.toLocaleString(), note: "queries containing 'growthbook'" },
                { label: "Non-Branded", value: d.gsc.nonbranded.toLocaleString(), note: "organic discovery traffic" },
                { label: "Anonymized", value: d.gsc.anonymized.toLocaleString(), note: "low-volume queries (GSC privacy)" },
              ].map((b, i) => (
                <div key={i} style={{ ...card({ padding: "14px 18px", flex: 1, minWidth: 160 }) }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>{b.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, margin: "4px 0 2px" }}>{b.value}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{b.note}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Executive Summary */}
          <Section title="Executive Summary">
            <div style={{ ...card({ padding: 20 }) }}>
              {d.exec_summary.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "14px 0 0", lineHeight: 1.65, color: "#2C3E50", fontSize: 14, textAlign: "left" }}>{p}</p>
              ))}
            </div>
          </Section>

          {/* Top 5 Competitor Content Opportunities */}
          <Section title="Top 5 Competitor Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Composite score (0–100): weighted blend of competitor domain authority, keyword difficulty (lower KD = easier to rank), and topic relevance. ≥75 = Quick Win | 60–74 = Content Gap | &lt;60 = Competitor Capture. KD 'n/a' = page too new, treat as low competition.
            </p>
            <Table
              headers={["What to Write", "Score", "KD", "Bucket", "Why It Matters"]}
              rows={[
                [
                  <span><strong>Feature Flags</strong><br /><a href="https://launchdarkly.com/platform/feature-flags" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">launchdarkly.com/platform/feature-flags</a></span>,
                  "75.0", "38", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>LaunchDarkly's feature flags platform page ranks for core feature flag queries with KD 38. GrowthBook has a strong feature flags product but no dedicated ranking page competing for this term.</span>
                ],
                [
                  <span><strong>Best Feature Flag Tools for Startups</strong><br /><a href="https://amplitude.com/compare/best-feature-flag-tools-for-startups" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-feature-flag-tools-for-startups</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Amplitude's comparison page targets startup buyers at the moment of vendor selection. Startups are GrowthBook's core audience. KD n/a = brand-new page, effectively zero competition.</span>
                ],
                [
                  <span><strong>Best Mobile A/B Testing for Developers</strong><br /><a href="https://amplitude.com/compare/best-mobile-ab-testing-for-developers" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-mobile-ab-testing-for-developers</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Developers are GrowthBook's primary persona. Amplitude owns this bottom-of-funnel query unopposed. No KD data — page too new for DataForSEO tracking.</span>
                ],
                [
                  <span><strong>Best Product Experimentation Tools for Startups</strong><br /><a href="https://amplitude.com/compare/best-product-experimentation-tools-for-startups" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/best-product-experimentation-tools-for-startups</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Third in Amplitude's startup experimentation cluster. Publishing all three GrowthBook equivalents in one sprint builds topical authority fast.</span>
                ],
                [
                  <span><strong>Top A/B Testing Platforms</strong><br /><a href="https://amplitude.com/compare/top-ab-testing-platforms" style={{ fontSize: 11, color: C.accent }} target="_blank" rel="noopener noreferrer">amplitude.com/compare/top-ab-testing-platforms</a></span>,
                  "75.0", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>High-intent comparison query. Amplitude is establishing itself as the go-to resource for buyers evaluating A/B testing platforms — GrowthBook is absent.</span>
                ],
              ]}
            />
          </Section>

          {/* Content Recommendations */}
          <Section title="Content Recommendations">
            <Table
              headers={["Action", "Score", "KD", "Bucket", "Rationale"]}
              rows={[
                [
                  <span style={{ fontSize: 13 }}>Write a /compare or /blog page targeting <strong>'Best feature flag tools for startups'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Frame GrowthBook as the open-source, startup-friendly alternative. Amplitude owns this query unopposed. Low KD, high buyer intent — highest-leverage quick win.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a developer-focused guide targeting <strong>'Best mobile A/B testing for developers'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Lead with GrowthBook's SDK-first, open-source positioning. Developers are the primary buyer persona and Amplitude currently has no competition here.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a startup experimentation guide targeting <strong>'Best product experimentation tools for startups'</strong></span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Third in the startup cluster. Publish all three as a sprint to build topical authority and intercept Amplitude's funnel at multiple entry points.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Write a page targeting <strong>'Top A/B testing platforms'</strong> — position GrowthBook as the open-source, warehouse-native option</span>,
                  "75", "n/a", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>Amplitude is building a comparison content moat. GrowthBook needs at least one 'best-of' page to compete in this category before the gap widens further.</span>
                ],
                [
                  <span style={{ fontSize: 13 }}>Refresh /compare/growthbook-vs-launchdarkly to address feature flags + experimentation use cases</span>,
                  "75", "38", <BucketBadge bucket="Quick Win" />,
                  <span style={{ fontSize: 12, color: "#555" }}>LaunchDarkly's feature flags page (KD 38) is the #1 ranked opportunity. The compare page got minimal clicks this week. Adding feature flags and experimentation depth would intercept buyers evaluating LaunchDarkly directly.</span>
                ],
              ]}
            />
          </Section>

          {/* Top 5 opportunities preview */}
          <Section title="Top 5 Content Opportunities">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {d.opportunities.map((o, i) => (
                <div key={i} style={{ ...card({ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }) }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, width: 32, textAlign: "center", flexShrink: 0 }}>#{o.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.primary }}>{o.topic}</span>
                      <BucketBadge bucket={o.bucket} />
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Lead: {o.competitor} · KD {o.kd} · Score {o.score}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{o.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>)}

        {/* ── OPPORTUNITIES ── */}
        {tab === "opportunities" && (<>
          <Section title="Top 5 Content Opportunities">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Composite score (0–100): weighted blend of competitor domain authority, keyword difficulty (lower KD = easier to rank), and topic relevance.
              ≥75 = Quick Win | 60–74 = Content Gap | &lt;60 = Competitor Capture. KD 'n/a' = page too new, treat as low competition.
            </p>
            <Table
              headers={["Rank", "Topic", "Competitor", "Score", "KD", "Bucket", "Why It Matters"]}
              rows={d.opportunities.map(o => [
                `#${o.rank}`, o.topic, o.competitor, o.score, o.kd,
                <BucketBadge bucket={o.bucket} />, <span style={{ fontSize: 12, color: "#555" }}>{o.why}</span>
              ])}
            />
          </Section>

          <Section title="Striking Distance (Positions 8–20)">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Pages ranking just outside the top 10 — incremental optimization could move these into click territory.
            </p>
            <Table
              headers={["Query", "Position", "Impressions", "Clicks", "Opportunity"]}
              rows={d.striking_distance.map(q => [
                q.query, q.position, q.impressions.toLocaleString(), q.clicks,
                <OpportunityBadge opp={q.opportunity} />
              ])}
              compact
            />
          </Section>
        </>)}

        {/* ── COMPETITORS ── */}
        {tab === "competitors" && (<>
          <Section title="Competitor Organic Traffic (ETV)">
            <div style={{ ...card({ padding: "18px 20px" }) }}>
              {(() => {
                const max = Math.max(...d.competitors.map(c => c.etv));
                return d.competitors.map(c => (
                  <Bar key={c.name} label={c.name} value={c.etv} max={max} color={COMP_COLORS[c.name] || C.accent} />
                ));
              })()}
              <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 10, marginBottom: 0, textAlign: "left" }}>
                Note: GrowthBook ETV (~186) underreports actual traffic. GSC shows ~9,700 clicks/mo — 45% is branded search, which ETV doesn't count.
              </p>
            </div>
          </Section>

          <Section title="Competitor Detail">
            <Table
              headers={["Competitor", "Total ETV", "Pages", "Top Page", "Top Page ETV"]}
              rows={d.competitors.map(c => [
                <span style={{ fontWeight: 600, color: COMP_COLORS[c.name] || C.primary }}>{c.name}</span>,
                c.etv.toLocaleString(), c.pages, c.top_page, c.top_etv.toLocaleString()
              ])}
            />
          </Section>
        </>)}

        {/* ── GSC DETAIL ── */}
        {tab === "gsc" && (<>
          <Section title="Top Movers — Gains">
            <Table
              headers={["Page", "This Week", "Prior Week", "Change"]}
              rows={d.top_movers.gains.map(m => [
                m.url, m.clicks, m.prior,
                <span style={{ color: C.success, fontWeight: 700 }}>+{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Top Movers — Declines">
            <Table
              headers={["Page", "This Week", "Prior Week", "Change"]}
              rows={d.top_movers.declines.map(m => [
                m.url, m.clicks, m.prior,
                <span style={{ color: C.danger, fontWeight: 700 }}>{m.change}</span>
              ])}
              compact
            />
          </Section>

          <Section title="Striking Distance (Positions 8–20)">
            <Table
              headers={["Query", "Position", "Impressions", "Clicks", "Opportunity"]}
              rows={d.striking_distance.map(q => [
                q.query, q.position, q.impressions.toLocaleString(), q.clicks,
                <OpportunityBadge opp={q.opportunity} />
              ])}
              compact
            />
          </Section>
        </>)}

        {/* ── YOUTUBE ── */}
        {tab === "youtube" && (() => {
          const channels = d.youtube.channels;
          const gbCh = channels.find(c => c.name === "GrowthBook") || { videos: [], avg_views: 0, video_count: 0 };
          const gbOutliers = (gbCh.videos || []).filter(v => v.is_outlier).sort((a, b) => b.mult - a.mult);
          const compOutliers = channels
            .filter(c => c.name !== "GrowthBook")
            .flatMap(c => (c.videos || []).filter(v => v.is_outlier).map(v => ({ ...v, competitor: c.name })))
            .sort((a, b) => b.mult - a.mult);

          const gbNarrative = gbOutliers.length === 0
            ? "No GrowthBook videos exceeded 2× channel average this week."
            : (() => {
                const top = gbOutliers[0];
                let line = `GrowthBook's '${top.title}' is running at ${top.mult}× channel average with ${top.views.toLocaleString()} views`;
                if (gbOutliers.length > 1) {
                  const others = gbOutliers.slice(1, 3).map(v => `'${v.title}' at ${v.mult}× with ${v.views.toLocaleString()} views`).join("; ");
                  line += `, followed by ${others}`;
                }
                return line + ".";
              })();

          const compNarrative = compOutliers.length === 0
            ? "No competitor videos exceeded 2× channel average this week."
            : "On the competitor side: " + compOutliers.slice(0, 4).map(v =>
                `${v.competitor}'s '${v.title.slice(0, 55)}${v.title.length > 55 ? "…" : ""}' at ${v.mult}× (${v.views.toLocaleString()} views)`
              ).join("; ") + ".";

          return (<>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.success}` }) }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>GrowthBook YouTube</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50", textAlign: "left" }}>{gbNarrative}</p>
              </div>
              <div style={{ ...card({ padding: 18, flex: 1, minWidth: 280, borderLeft: `4px solid ${C.accent}` }) }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Competitor YouTube</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "#2C3E50", textAlign: "left" }}>{compNarrative}</p>
              </div>
            </div>

            <Section title="All Channels — YouTube Tracker (90-day window, 2× outlier threshold)">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1B4F72" }}>
                    {["Channel", "Videos (90d)", "Avg Views", "Outliers", "Title", "Views", "Mult", "Date"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", color: "#fff", textAlign: "left", fontWeight: 700, whiteSpace: "nowrap", ...(h === "Title" ? { minWidth: 360 } : {}) }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, ci) => {
                    const isGB = ch.name === "GrowthBook";
                    const outlierVids = (ch.videos || []).filter(v => v.is_outlier);
                    const topNonOutliers = (ch.videos || []).filter(v => !v.is_outlier).sort((a, b) => b.views - a.views).slice(0, 2);
                    const displayVids = ch.no_recent ? [] : [...outlierVids, ...topNonOutliers];
                    const outlierCount = outlierVids.length;
                    const rowBg = isGB ? "#F0FFF4" : (ci % 2 === 0 ? "#fff" : "#F8F9FA");
                    const chColor = isGB ? C.success : (COMP_COLORS[ch.name] || C.primary);

                    if (ch.no_recent) {
                      return (
                        <tr key={ch.name} style={{ background: rowBg }}>
                          <td style={{ padding: "5px 8px", fontWeight: 700, color: chColor }}>{ch.name}</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "center" }}>0</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "right" }}>—</td>
                          <td style={{ padding: "5px 8px", color: C.muted, textAlign: "center" }}>0</td>
                          <td style={{ padding: "5px 8px", color: C.muted, fontStyle: "italic" }}>No uploads in last 90 days</td>
                          <td colSpan={4} />
                        </tr>
                      );
                    }

                    return displayVids.map((v, vi) => (
                      <tr key={`${ch.name}-${vi}`} style={{ background: rowBg, borderBottom: "1px solid #E9ECEF" }}>
                        {vi === 0 ? (
                          <>
                            <td style={{ padding: "5px 8px", fontWeight: 700, color: chColor, verticalAlign: "top" }}>{ch.name}</td>
                            <td style={{ padding: "5px 8px", color: C.muted, verticalAlign: "top", textAlign: "center" }}>{ch.video_count}</td>
                            <td style={{ padding: "5px 8px", color: C.muted, verticalAlign: "top", textAlign: "right" }}>{(ch.avg_views || 0).toLocaleString()}</td>
                            <td style={{ padding: "5px 8px", color: outlierCount > 0 ? C.danger : C.muted, fontWeight: outlierCount > 0 ? 700 : 400, verticalAlign: "top", textAlign: "center" }}>{outlierCount}</td>
                          </>
                        ) : (
                          <><td /><td /><td /><td /></>
                        )}
                        <td style={{ padding: "5px 8px", minWidth: 360, maxWidth: 480, textAlign: "left" }}>{v.is_outlier ? "🔥 " : "📊 "}<a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseOver={e => e.target.style.textDecoration="underline"} onMouseOut={e => e.target.style.textDecoration="none"}>{v.title}</a></td>
                        <td style={{ padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap" }}>{v.views.toLocaleString()}</td>
                        <td style={{ padding: "5px 8px", fontWeight: 700, color: isGB ? C.success : C.accent, whiteSpace: "nowrap" }}>{v.mult}×</td>
                        <td style={{ padding: "5px 8px", color: C.muted, whiteSpace: "nowrap" }}>{v.date}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
                🔥 = 2× or more views vs channel's 90-day average. 📊 = top non-outlier videos for context. Source: YouTube Data API v3.
              </p>
            </Section>
          </>);
        })()}

        {/* ── NEW CONTENT ── */}
        {tab === "content" && (<>
          <Section title="New Competitor Pages This Week (High-Threat)">
            <Table
              headers={["Competitor", "Page / Topic", "Published", "Threat", "KD"]}
              rows={d.new_content.map(n => [
                <span style={{ color: COMP_COLORS[n.competitor] || C.primary, fontWeight: 600 }}>{n.competitor}</span>,
                n.slug,
                n.date || "—",
                <span style={{ fontWeight: 700, color: n.threat >= 8 ? C.danger : C.warning }}>{n.threat}/10</span>,
                n.kd
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              Amplitude's comparison content cluster (best feature flag tools for startups, best mobile A/B testing for developers) is the highest-priority threat — brand new pages with effectively zero competition.
            </p>
          </Section>
        </>)}

        {/* ── ETV vs KD ── */}
        {tab === "etv_kd" && (<>
          <Section title="Top Pages: ETV vs Keyword Difficulty">
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 14, textAlign: "left" }}>
              Top competitor pages ranked by estimated monthly visitors (ETV), with their keyword difficulty (KD 0–100). Lower KD = easier to rank; higher ETV = more traffic at stake. Pages in the top-left quadrant (high ETV, low KD) are the highest-leverage targets.
            </p>
            <Table
              headers={["Competitor", "Title", "URL", "ETV", "KD"]}
              rows={d.etv_kd.map(row => [
                <span style={{ color: COMP_COLORS[row.competitor] || C.primary, fontWeight: 600 }}>{row.competitor}</span>,
                row.title,
                <a href={`https://${row.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }} onMouseOver={e => e.target.style.textDecoration="underline"} onMouseOut={e => e.target.style.textDecoration="none"}>{row.url}</a>,
                row.etv.toLocaleString(),
                <span style={{ fontWeight: 700, color: row.kd >= 60 ? C.danger : row.kd >= 30 ? C.warning : C.success }}>{row.kd}</span>,
              ])}
            />
            <p style={{ fontSize: 12, color: C.muted, marginTop: 10, textAlign: "left" }}>
              KD color: <span style={{ color: C.success, fontWeight: 700 }}>green = easy (&lt;30)</span> · <span style={{ color: C.warning, fontWeight: 700 }}>orange = moderate (30–59)</span> · <span style={{ color: C.danger, fontWeight: 700 }}>red = hard (60+)</span>.
              Source: DataForSEO. GrowthBook ETV underreports — see GSC for actual traffic.
            </p>
          </Section>
        </>)}

      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 24px", textAlign: "center", color: C.muted, fontSize: 12, background: C.white }}>
        Compy · GrowthBook Competitive Intelligence · {WEEK} · Data: GSC + DataForSEO + YouTube API
      </div>
    </div>
  );
}

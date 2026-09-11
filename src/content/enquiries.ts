export const enquiryTypes = [
  { id: "development", label: "Website / Development", prompt: "Tell us about your website", placeholder: "What does your business do, and what would you like the website to achieve?", detailLabel: "Business or project name (optional)" },
  { id: "video-help", label: "Video-related Help", prompt: "Where are you stuck?", placeholder: "Which step did you try, and what happened?", detailLabel: "Video link" },
  { id: "gaming", label: "Gaming", prompt: "What do you have in mind?", placeholder: "Tell us about the game, challenge, or project you would like to discuss.", detailLabel: "Game or project (optional)" },
  { id: "collaboration", label: "Collaboration", prompt: "Tell us about your idea", placeholder: "What would you like to create together?", detailLabel: "Channel or website link (optional)" },
  { id: "business", label: "Business Enquiry", prompt: "How can we work together?", placeholder: "A little about your business and the opportunity.", detailLabel: "Company (optional)" },
  { id: "other", label: "Something Else", prompt: "What would you like to talk about?", placeholder: "Tell us a little about your question or idea.", detailLabel: "" }
] as const;

export type EnquiryType = typeof enquiryTypes[number]["id"];

export function findEnquiryType(id?: string) {
  return enquiryTypes.find((item) => item.id === id);
}

export const workOpportunities = [
  {
    id: "development",
    title: "A website for your business.",
    summary: "Complete websites for small businesses, growing companies, startups, and service-based teams. Let's talk about what you need to build.",
    note: "Website projects / Freelance work / Partnerships",
    action: "Discuss a website"
  },
  {
    id: "video-help",
    title: "A little help with a video.",
    summary: "Tried something from the channel and got stuck? Share the video and the step you reached so we can understand the problem.",
    note: "Video questions / Troubleshooting / Resource help",
    action: "Ask about a video"
  },
  {
    id: "gaming",
    title: "An idea worth playing.",
    summary: "Have a gaming challenge, gameplay project, or collaboration in mind? Tell us the game and what you would like to try.",
    note: "Challenges / Gameplay projects / Creator collaborations",
    action: "Share a gaming idea"
  },
  {
    id: "collaboration",
    title: "Something we can create together.",
    summary: "Content ideas, brand enquiries, and creative or technical partnerships. Start with the idea and we'll take the conversation from there.",
    note: "YouTube / Brand & content / Technical partnerships",
    action: "Start a collaboration"
  }
] as const;

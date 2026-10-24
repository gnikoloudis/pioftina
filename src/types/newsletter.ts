export type NewsletterTopic = "deals" | "recipes" | "budget_tips";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  topics: NewsletterTopic[];
  subscribedAt: string;
  source: "footer" | "header_modal" | "settings";
  status: "active" | "unsubscribed";
  userAgent?: string;
}

export interface NewsletterSubscribeRequest {
  email: string;
  topics?: NewsletterTopic[];
  source?: "footer" | "header_modal" | "settings";
}

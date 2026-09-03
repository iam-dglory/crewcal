export type ContentTypeRow = {
  id: string;
  name: string;
  color: string;
};

export type MemberOption = {
  id: string;
  full_name: string | null;
  email: string;
};

export type ContentItemWithJoins = {
  id: string;
  workspace_id: string;
  date: string;
  title: string;
  status: string;
  notes: string | null;
  content_type_id: string | null;
  assigned_to: string | null;
  content_type: ContentTypeRow | null;
  assignee: MemberOption | null;
};

export type RateCardRow = { label: string; price: string };

export type TalentProfileWithProfile = {
  user_id: string;
  role_type: string;
  headline: string;
  bio: string | null;
  niches: string[];
  rate_card: RateCardRow[];
  portfolio_links: string[];
  is_public: boolean;
  profile: MemberOption | null;
};

export type InquiryWithProfiles = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  talent_user_id: string;
  initiator_user_id: string;
  talent: MemberOption | null;
  initiator: MemberOption | null;
};

export type InquiryMessageWithSender = {
  id: string;
  inquiry_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
  sender: MemberOption | null;
};

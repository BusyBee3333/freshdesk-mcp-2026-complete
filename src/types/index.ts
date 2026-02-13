// FreshDesk API Types

export interface FreshDeskConfig {
  domain: string;
  apiKey: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  description_text?: string;
  status: number;
  priority: number;
  type?: string;
  source: number;
  requester_id: number;
  responder_id?: number;
  group_id?: number;
  company_id?: number;
  product_id?: number;
  tags?: string[];
  cc_emails?: string[];
  fwd_emails?: string[];
  email_config_id?: number;
  fr_escalated?: boolean;
  spam?: boolean;
  due_by?: string;
  fr_due_by?: string;
  is_escalated?: boolean;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  associated_tickets_count?: number;
  attachments?: Attachment[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  twitter_id?: string;
  unique_external_id?: string;
  company_id?: number;
  description?: string;
  job_title?: string;
  language?: string;
  time_zone?: string;
  tags?: string[];
  address?: string;
  custom_fields?: Record<string, any>;
  active?: boolean;
  deleted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  domains?: string[];
  note?: string;
  custom_fields?: Record<string, any>;
  health_score?: string;
  account_tier?: string;
  renewal_date?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  available?: boolean;
  occasional?: boolean;
  signature?: string;
  ticket_scope?: number;
  group_ids?: number[];
  role_ids?: number[];
  created_at: string;
  updated_at: string;
  contact: Contact;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  escalate_to?: number;
  unassigned_for?: string;
  business_calendar_id?: number;
  agent_ids?: number[];
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  primary_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  body: string;
  body_text?: string;
  user_id: number;
  ticket_id: number;
  to_emails?: string[];
  from_email?: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  incoming?: boolean;
  private?: boolean;
  source?: number;
  category?: number;
  support_email?: string;
  attachments?: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  billable?: boolean;
  timer_running?: boolean;
  time_spent?: string;
  executed_at?: string;
  task_id?: number;
  note?: string;
  agent_id: number;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  name: string;
  content_type: string;
  size: number;
  attachment_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Forum {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  forum_type: number;
  forum_visibility: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  forum_id: number;
  title: string;
  message?: string;
  user_id: number;
  sticky?: boolean;
  locked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SolutionCategory {
  id: number;
  name: string;
  description?: string;
  visible_in_portals?: number[];
  created_at: string;
  updated_at: string;
}

export interface SolutionFolder {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  visibility: number;
  created_at: string;
  updated_at: string;
}

export interface SolutionArticle {
  id: number;
  folder_id: number;
  title: string;
  description: string;
  status: number;
  article_type?: number;
  tags?: string[];
  seo_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CannedResponse {
  id: number;
  title: string;
  content: string;
  content_html?: string;
  group_ids?: number[];
  visibility?: number;
  created_at: string;
  updated_at: string;
}

export interface SatisfactionRating {
  id: number;
  survey_id: number;
  user_id: number;
  ticket_id: number;
  rating: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketField {
  id: number;
  name: string;
  label: string;
  description?: string;
  type: string;
  default?: boolean;
  required_for_closure?: boolean;
  required_for_agents?: boolean;
  required_for_customers?: boolean;
  customers_can_edit?: boolean;
  label_for_customers?: string;
  position: number;
  choices?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
}

export interface FreshDeskError {
  description: string;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

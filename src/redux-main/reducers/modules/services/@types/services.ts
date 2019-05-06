export type Service = {
  created_at: string;
  from: string;
  id: number;
  is_active: boolean;
  last_action_at: string;
  name: string;
  slug: string;
  to: string;
  updated_at: string;
  url: string;
  user_id: number;
  user_login: string;

  files: any[];
};

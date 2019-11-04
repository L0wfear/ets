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

  files: Array<any>;
};

export type ServiceHistroy = {
  action: string;
  action_at: string;
  action_name: string;
  id: number;
  remote_ip: string;
  service_id: number;
  user_id: number;
  user_login: string;
};

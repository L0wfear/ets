import { IResponseRowObject } from 'api/@types/rest.h';

export interface IUserNotification extends IResponseRowObject<number> {
  type_id: number;
  is_read: boolean;
  type_name: string;
  title: string;
  type_code: string;
  description: string;
  priority: 'info' | 'warning' | 'alert';
  created_at: string;
  data: {};
  additional_info: string;
  gov_number: string;
}

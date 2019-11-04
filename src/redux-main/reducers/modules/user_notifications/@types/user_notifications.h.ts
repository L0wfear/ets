export type TypeCode = 'administrator'
| 'manual_update'
| 'order'
| 'insurance_policy'
| 'tech_maintenance'
| 'repair'
| 'tech_inspection'
| 'medical_certificate';

export type Priority = 'info' | 'warning' | 'alert';

export type FrontType = 'adm' | 'common';

export type Group = 'common' | 'personal';

export namespace DataByTypeCode {
  export type MedicalCertificate = {
    employee_fio: string;
    days_left: number;
    employee_id: number;
  };

  export type DataInsurancePolicy = {
    car_gov_number: string;
    car_id: number;
    days_left: number;
    insurance_policy_id: number;
    insurance_type_id: number;
    insurance_type_name: string;
  };
}

export type CommonNotification = {
  additional_info: string | null;
  created_at: string;
  data: DataByTypeCode.MedicalCertificate
  | DataByTypeCode.DataInsurancePolicy;
  description: 'string';
  front_type: 'common';
  gov_number: null;
  group: Group;
  id: number;
  isChecked: undefined;
  isHighlighted: false;
  isSelected: false;
  is_read: true;
  priority: Priority;
  title: string;
  type_code: TypeCode;
  type_id: number;
  type_name: string;
  user_id: number;
};

export type UserNotification = AdmNotification | CommonNotification;

export type AdmNotification = {
  additional_info: null | string;
  created_at: string;
  data: any;
  description: string;
  front_type: 'adm';
  group: Group;
  id: number;
  is_read: boolean;
  priority: Priority;
  title: string;
  type_code: TypeCode;
  type_id: number;
  type_name: string;
  user_id: number;
};

export type OrderNotRead = CommonNotification;

export type AdmNotReadNotifications = AdmNotification;

export type IStateUserNotifications = {
  commonNotificationList: Array<CommonNotification>;
  userNotificationList: Array<UserNotification>;
  admNotificationList: Array<AdmNotification>;
  orderNotReadList: Array<OrderNotRead>;
  admNotReadNotificationsList: Array<AdmNotReadNotifications>;
  countNotRead: number;
};

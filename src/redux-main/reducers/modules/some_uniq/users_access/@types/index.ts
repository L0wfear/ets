export type User = {
  id: number;
  for: string;  // Раздел настроек доступа; пока всегда inspect
  user_id: number;
  okrug_name: string;
  company_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  personnel_number: string;
  position_name: string;
  status: string;  // Статус
  access_okrugs: Array<{id: number; name: string;}>;
  access_okrugs_text: string;  // Доступ к округу
  access_okrugs_ids: Array<number>;
  access_companies: Array<{id: number; name: string;}>;
  access_companies_text: string;  // Доступ к организации
  access_companies_ids: Array<number>;
  okrug_name_text: string;  // Округ
  company_name_text: string;  // Организация
  personnel_number_text: string;  // Табельный номер
  position_name_text: string;  // Должность
  full_name: string;
  full_name_text: string;  // ФИО
};

export type CreateUserAccessPayload = {
  user_id: User['user_id'];
  for: User['for'];
  access_okrugs?: User['access_okrugs'];
  access_companies?: User['access_companies'];
};

export type UpdtateUserAccessPayload = {
  access_okrugs?: User['access_okrugs'];
  access_companies?: User['access_companies'];
};

export type GetUserAccessPayload = {
  for: User['for'];
};

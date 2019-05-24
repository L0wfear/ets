export type EdcMissionData = {
  car_model_name: string;
  car_special_model_name: string;
  current_percentage: number;
  date_end: string;
  employee: string;
  gov_number: string;
  id: number;
  municipal_facility_name: string;
  name: string;
  number: number;
  status: string;
  status_name: string;                  // <<< Добавить бэку
  technical_operation_name: string;
  type_name: string;
  type_mission: 'mission';
};

export type EdcDutyMissionData = {
  date_end: string;
  employee: string;
  id: number;
  municipal_facility_name: string;
  name: string;
  number: number;
  status: string;
  status_name: string;                  // <<< Добавить бэку
  technical_operation_name: string;
  type_mission: 'duty_mission';
};

export type EdcRequestInfo = {
  edc_date: string;
  missions: (
    {
      front_custom_id: number;          // <<< Руками в промисе promiseGetEdcRequestInfo index + 1;
      mission_title: string;            // <<< Руками в промисе promiseGetEdcRequestInfo
    } & (
      EdcMissionData
      | EdcDutyMissionData
    )
  )[]
};

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
  status_name: string;                  // статус задания, на русском
  technical_operation_name: string;
  type_name: string;
  type_mission: 'mission';              // тип задания 'mission | duty_mission'
  title_name: string; // формируется в промисе
  transport_name: string; // формируется в промисе
};

export type EdcDutyMissionData = {
  date_end: string;
  employee: string;
  id: number;
  municipal_facility_name: string;
  current_percentage: never;
  name: string;
  number: number;
  status: string;
  status_name: string;                  // статус задания, на русском
  technical_operation_name: string;
  type_mission: 'duty_mission';         // тип задания 'mission | duty_mission'
  title_name: string; // формируется в промисе
  transport_name: string; // формируется в промисе
};

export type EdcRequestInfo = {
  edc_date: string; // create_date из заявки
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

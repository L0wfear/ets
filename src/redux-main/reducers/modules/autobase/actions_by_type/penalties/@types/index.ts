export type PenaltyMissions = {
  id: number;
  number: number;
};

export type PenaltyWaybills = {
  id: number;
  number: number;
};

export type Penalty = {
  article_koap: string;
  company_id: number;
  company_name: string;
  company_short_name: string;
  driver_id: number;
  driver_fio: string;
  files: Array<any>;
  id: number;
  is_appealed: boolean;
  is_paid: boolean;
  missions: Array<PenaltyMissions>;
  missions_text: string;
  odps_code: number;
  odps_name: string;
  okrug_id: number;
  okrug_name: string;
  passport_number: string;
  paid_id: number;
  ruling_date: string;
  ruling_number: string;
  sum_to_pay: number;
  violation_datetime: string;
  violation_document_number: number;
  violation_document_type: string;
  violation_document_type_text: string;
  violation_place: string;
  waybills: Array<PenaltyWaybills>;
  waybills_text: string;
};

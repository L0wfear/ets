export type PenaltyMissions = {
  id: number;
  number: number;
};

export type PenaltyWaybills = {
  id: number;
  number: number;
};

export type Penalty = {
  company_id: number;
  company_name: string;
  company_short_name: string;
  driver_id: number;
  driver_fio: string;
  id: number;
  is_appealed: boolean;
  missions: Array<PenaltyMissions>;
  missions_text: string;
  okrug_id: number;
  okrug_name: string;
  violation_datetime: string;
  violation_document_number: number;
  waybills: Array<PenaltyWaybills>;
  waybills_text: string;
};

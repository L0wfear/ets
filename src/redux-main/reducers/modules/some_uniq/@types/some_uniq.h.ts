export type SpecialModel = {
  body_space?: any | null;
  id: number;
  name: string;
};
export type CancelReasons = {
  id: number;
  name: string;
  status: string;
};

export type IStateSomeUniq = {
  specialModelList: SpecialModel[];
  missionCancelReasonsList: CancelReasons[];
};

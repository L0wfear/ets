export type SpecialModel = {
  body_space?: any | null;
  id: number;
  name: string;
};

export type modelListElement = {
  body_capacity: number | null;
  full_name: string | null;
  id: number;
  load_capacity: number | null;
  max_speed: number;
  title: string | null;
};

export type IStateSomeUniq = {
  specialModelList: SpecialModel[];
  modelsList: modelListElement[];
};

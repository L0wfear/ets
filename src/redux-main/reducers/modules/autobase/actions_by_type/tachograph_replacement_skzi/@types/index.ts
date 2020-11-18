export type TachographReplacementSkziList = {
  id: number;
  tachograph_id: number;
  replacement_date: string | Date;
  next_replacement_date: string | Date;
  replacement_reason_id: number;
  replacement_reason_name: string;
};

export type TachographReplacementSkziPayload = {
  tachograph_id: number;
  replacement_skzi: Array<TachographReplacementSkziList>;
};
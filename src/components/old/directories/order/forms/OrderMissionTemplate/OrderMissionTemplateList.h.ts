export type ICheckedElements = {
  [id: number]: any;
};

export type IStateOrderMissionTemplate = {
  assign_to_waybill: string;
  assign_to_waybill_for_column: object;
  missionsList: Array<any>;
  missionsIndex: any;
  selectedElement: void | any;
  checkedElements: ICheckedElements;
  structures: Array<any>;
  timeInterval: number | NodeJS.Timer;
  canSubmit: boolean;
  showColumnAssignment: boolean;
};

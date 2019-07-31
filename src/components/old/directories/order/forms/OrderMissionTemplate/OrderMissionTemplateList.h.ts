export interface ICheckedElements {
  [id: number]: any;
}

export interface IStateOrderMissionTemplate {
  assign_to_waybill: string;
  assign_to_waybill_for_column: object;
  missionsList: any[];
  missionsIndex: any;
  selectedElement: void | any;
  checkedElements: ICheckedElements;
  structures: any[];
  timeInterval: number | NodeJS.Timer;
  canSubmit: boolean;
  showColumnAssignment: boolean;
}

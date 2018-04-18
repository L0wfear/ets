export interface ICheckedElements {
  [id: number]: any;
}

export interface IStateOrderMissionTemplate {
  assign_to_waybill: string;
  missionsList: any[];
  selectedElement: void | any;
  checkedElements: ICheckedElements;
  structures: any[];
  timeInterval: number | NodeJS.Timer;
  canSubmit: boolean;
}

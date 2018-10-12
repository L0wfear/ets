export interface StatePropsDashboardMenuButtons {
};

export type DispatchPropsDashboardMenuButtons = {
  loadDataAfterCreateWaybill: any;
  loadDataAfterCreateMission: any;
  loadDataAfterCreateDutyMission: any;
};

export interface OwnerPropsDashboardMenuButtons {
}

export type PropsDashboardMenuButtons = (
  StatePropsDashboardMenuButtons
  & DispatchPropsDashboardMenuButtons
  & OwnerPropsDashboardMenuButtons
);

export interface StateDashboardMenuButtons {
}

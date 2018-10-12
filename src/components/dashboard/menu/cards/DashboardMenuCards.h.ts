export interface StatePropsDashboardMenuCards {
};

export interface DispatchPropsDashboardMenuCards {
  dashBoardResetData: () => any;
};

export interface OwnerPropsDashboardMenuCards {
};

export type PropsDashboardMenuCards = (
  StatePropsDashboardMenuCards
  & DispatchPropsDashboardMenuCards
  & OwnerPropsDashboardMenuCards
);

export interface StateDashboardMenuCards {}

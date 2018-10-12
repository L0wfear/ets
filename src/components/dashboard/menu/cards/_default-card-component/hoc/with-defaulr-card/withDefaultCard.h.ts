import { InitialStateDashboard } from "components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h";

export type StatePropsDefaultCard = {
  isLoading: boolean;
  title: any;
  dateLoad: Date;
};

export type DispatchPropsDefaultCard = {
  loadData: () => Promise<any>
};

export type OwnerPropsDefaultCard = {
  timeInterval?: number;
  timeDelay: number;
};

export type PropsDefaultCard = StatePropsDefaultCard
  & DispatchPropsDefaultCard
  & OwnerPropsDefaultCard;

export type StateDefaultCard = {
  inLoadByLocalRefresh: boolean;
  timerId: any;
};

export type ConfigType = {
  path: keyof InitialStateDashboard;
  loadData: Function;
  InfoComponent?: React.ComponentClass<{}>;
};
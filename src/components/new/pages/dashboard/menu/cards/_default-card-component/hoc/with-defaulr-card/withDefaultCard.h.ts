import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';

export type StatePropsDefaultCard = {
  isLoading: boolean;
  title: any;
  dateLoad: void | Date;
};

export type DispatchPropsDefaultCard = {
  loadData: () => Promise<any>;
};

export type PropsToDefaultCard = {
  timeInterval?: number;
  timeDelay: number;
  page?: string;
};

export type OwnerPropsDefaultCard<P> = P & PropsToDefaultCard;

export type PropsDefaultCard<P> = StatePropsDefaultCard
  & DispatchPropsDefaultCard
  & OwnerPropsDefaultCard<P>;

export type StateDefaultCard = {
  inLoadByLocalRefresh: boolean;
  timerId: any;
};

export type ConfigType = {
  path: keyof InitialStateDashboard;
  loadData: any;
  InfoComponent?: React.ComponentClass<{}>;
};

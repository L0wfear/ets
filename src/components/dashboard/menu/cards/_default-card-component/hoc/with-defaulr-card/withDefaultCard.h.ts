export type StatePropsDefaultCard = {
  isLoading: boolean;
  title: string;
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
};

export type StateDefaultCard = {
  inLoadByLocalRefresh: boolean;
  timerId: any;
};

export type ConfigType = {
  path: string;
  loadData: Function;
  InfoComponent?: React.ComponentClass<{}>;
};
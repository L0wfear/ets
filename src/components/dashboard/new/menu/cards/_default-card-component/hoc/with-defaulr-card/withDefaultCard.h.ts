export type PropsDefaultCard = {
  title: string;
  isLoading: boolean;
  loadData: () => Promise<any>;
  timeDelay: number;
  dateLoad: Date;
};

export type StateDefaultCard = {
  dateLoad: Date;
  inLoadByLocalRefresh: boolean;
  timerId: any;
};

export type ConfigType = {
  path: string;
  loadData: Function;
  InfoComponent?: React.ComponentClass<{}>;
};
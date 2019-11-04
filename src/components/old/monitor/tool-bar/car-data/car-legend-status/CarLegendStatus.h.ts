export type PropsCarLegendStatus = {
  toggleActiveStatus: React.MouseEventHandler<HTMLDivElement>;
  toggleShowStatus: React.MouseEventHandler<HTMLDivElement>;

  carsByStatus: {
    in_move: number;
    stop: number;
    parking: number;
    not_in_touch: number;
  };
  in_move: boolean;
  stop: boolean;
  parking: boolean;
  not_in_touch: boolean;
};

type OneStatus = {
  key: string;
  status: number;
  title: string;
  storeName: string;
};

export type ListStatusType = Array<OneStatus>;

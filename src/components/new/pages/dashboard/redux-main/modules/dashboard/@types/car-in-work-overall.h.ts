
export type CarInWorkOverallItemsSubItemsType = {
  title: string;
};

export type CarInWorkOverallItemsType = {
  subItems?: Array<CarInWorkOverallItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type CarInWorkOverallAnsType = {
  items: Array<CarInWorkOverallItemsType>;
  title: string;
};

export type CarInWorkOverallInfoDataType = CarInWorkOverallItemsType;

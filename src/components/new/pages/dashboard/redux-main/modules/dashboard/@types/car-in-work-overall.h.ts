export type CarInWorkOverallItemsSubItemsSubItemsType = {
  title: string;
};

export type CarInWorkOverallItemsSubItemsType = {
  title: string;
  subItems: Array<CarInWorkOverallItemsSubItemsSubItemsType>;
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

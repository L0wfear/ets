
export type CarInWorkOverallItemsSubItemsType = {
  title: string;
};

export type CarInWorkOverallItemsType = {
  subItems?: CarInWorkOverallItemsSubItemsType[],
  tooltip?: string;
  title: string;
};

export type CarInWorkOverallAnsType = {
  items: CarInWorkOverallItemsType[];
  title: string;
};

export type CarInWorkOverallInfoDataType = CarInWorkOverallItemsType;

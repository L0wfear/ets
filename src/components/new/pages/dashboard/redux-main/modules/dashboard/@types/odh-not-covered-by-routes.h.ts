export type OdhNotCoveredByRoutesItemsSubItemsType = string;

export type OdhNotCoveredByRoutesItemsType = {
  subItems: Array<OdhNotCoveredByRoutesItemsSubItemsType>;
  tooltip?: string;
  title: string;
  technical_operation_id: number;
};

export type OdhNotCoveredByRoutesAnsType = {
  items: Array<OdhNotCoveredByRoutesItemsType>;
  tooltip?: string;
  title: string;
};

export type OdhNotCoveredByRoutesInfoDataType = OdhNotCoveredByRoutesItemsType;

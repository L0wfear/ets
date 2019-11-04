export type OdhCoveredByRoutesItemsSubItemsType = string;

export type OdhCoveredByRoutesItemsType = {
  subItems: Array<OdhCoveredByRoutesItemsSubItemsType>;
  tooltip?: string;
  title: string;
  technical_operation_id: number;
};

export type OdhCoveredByRoutesAnsType = {
  items: Array<OdhCoveredByRoutesItemsType>;
  tooltip?: string;
  title: string;
};

export type OdhCoveredByRoutesInfoDataType = OdhCoveredByRoutesItemsType;

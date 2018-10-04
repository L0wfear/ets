export type OdhNotCoveredByRoutesItemsSubItemsType = string;

export type OdhNotCoveredByRoutesItemsType = {
  subItems: OdhNotCoveredByRoutesItemsSubItemsType[],
  tooltip?: string;
  title: string;
  technical_operation_id: number;
}

export type OdhNotCoveredByRoutesAnsType = {
  items: OdhNotCoveredByRoutesItemsType[];
  tooltip?: string;
  title: string;
};

export type OdhNotCoveredByRoutesInfoDataType = OdhNotCoveredByRoutesItemsType;

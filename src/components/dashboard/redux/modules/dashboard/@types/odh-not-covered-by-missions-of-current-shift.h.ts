export type OdhNotCoveredByMissionsOfCurrentShiftItemsSunItemsType = string;

export type OdhNotCoveredByMissionsOfCurrentShiftItemsType = {
  subItems: OdhNotCoveredByMissionsOfCurrentShiftItemsSunItemsType[],
  tooltip?: string;
  technical_operation_id: number;
  title: string;
}

export type OdhNotCoveredByMissionsOfCurrentShiftAnsType = {
  items: OdhNotCoveredByMissionsOfCurrentShiftItemsType[];
  tooltip?: string;
  title: string;
};

export type OdhNotCoveredByMissionsOfCurrentShiftInfoDataType = OdhNotCoveredByMissionsOfCurrentShiftItemsType;

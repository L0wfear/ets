export type OdhNotCoveredByMissionsOfCurrentShiftItemsSunItemsType = {
  left_passes: number;
  name: string;
};

export type OdhNotCoveredByMissionsOfCurrentShiftItemsType = {
  sub_items: Array<OdhNotCoveredByMissionsOfCurrentShiftItemsSunItemsType>;
  tooltip?: string;
  technical_operation_id: number;
  title: string;
};

export type OdhNotCoveredByMissionsOfCurrentShiftAnsType = {
  items: Array<OdhNotCoveredByMissionsOfCurrentShiftItemsType>;
  tooltip?: string;
  title: string;
};

export type OdhNotCoveredByMissionsOfCurrentShiftInfoDataType = OdhNotCoveredByMissionsOfCurrentShiftItemsType;

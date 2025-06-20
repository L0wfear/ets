import { OdhNotCoveredByMissionsOfCurrentShiftInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';

export type PropsOdhNotCoveredByMissionsOfCurrentShiftInfo = {
  infoData: OdhNotCoveredByMissionsOfCurrentShiftInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

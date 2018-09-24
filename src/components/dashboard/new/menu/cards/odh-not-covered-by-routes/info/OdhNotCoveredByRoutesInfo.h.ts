import { OdhNotCoveredByRoutesInfoDataType } from 'components/dashboard/new/redux/modules/dashboard/@types/odh-not-covered-by-routes.h';

export type PropsOdhNotCoveredByRoutesInfo = {
  infoData: OdhNotCoveredByRoutesInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

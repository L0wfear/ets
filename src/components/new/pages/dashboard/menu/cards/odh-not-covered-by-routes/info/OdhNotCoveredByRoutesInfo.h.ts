import { OdhNotCoveredByRoutesInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-routes.h';

export type PropsOdhNotCoveredByRoutesInfo = {
  infoData: OdhNotCoveredByRoutesInfoDataType;
  history: any;
  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

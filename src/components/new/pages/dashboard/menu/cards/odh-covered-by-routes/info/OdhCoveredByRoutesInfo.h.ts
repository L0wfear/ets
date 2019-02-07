import { OdhCoveredByRoutesInfoDataType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';

export type PropsOdhCoveredByRoutesInfo = {
  infoData: OdhCoveredByRoutesInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

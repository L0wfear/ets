import { OdhCoveredByRoutesInfoDataType } from 'components/dashboard/redux/modules/dashboard/@types/odh-covered-by-routes.h';

export type PropsOdhCoveredByRoutesInfo = {
  infoData: OdhCoveredByRoutesInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

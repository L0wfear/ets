import { FaxogrammsInfoDataType } from 'components/dashboard/redux/modules/dashboard/@types/faxogramms.h';

export type PropsFaxogrammsInfo = {
  infoData: FaxogrammsInfoDataType;
  saveFaxogramm: Function;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

export type StateFaxogrammsInfo = {
  showFaxogrammMissionsFormWrap: boolean;
  elementFaxogrammMissionsFormWrap: any;

  blob: any;
  showPDFViewModal: boolean;
}
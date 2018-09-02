import { FaxogrammsInfoDataType } from 'components/dashboard/new/redux/modules/dashboard/@types/faxogramms.h';

export type PropsFaxogrammsInfo = {
  infoData: FaxogrammsInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

export type StateFaxogrammsInfo = {
  showFaxogrammMissionsFormWrap: boolean;
  elementFaxogrammMissionsFormWrap: any;

  blob: any;
  showPDFViewModal: boolean;
}
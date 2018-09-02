import {
  FaxogrammsAnsMetaType,
  FaxogrammsInfoDataType
} from 'components/dashboard/new/redux/modules/dashboard/@types/faxogramms.h';

export type PropsFaxogrammsInfo = {
  infoData: FaxogrammsInfoDataType;
  meta: FaxogrammsAnsMetaType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

export type StateFaxogrammsInfo = {
  showFaxogrammMissionsFormWrap: boolean;
  elementFaxogrammMissionsFormWrap: any;

  blob: any;
  showPDFViewModal: boolean;
}
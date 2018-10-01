import {
  FaxogrammsAnsMetaType,
  FaxogrammsInfoDataType
} from 'components/dashboard/redux-main/modules/dashboard/@types/faxogramms.h';

export type PropsFaxogrammsInfo = {
  infoData: FaxogrammsInfoDataType;
  meta: FaxogrammsAnsMetaType;
  saveOrder: Function;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

export type StateFaxogrammsInfo = {
  showFaxogrammMissionsFormWrap: boolean;
  elementFaxogrammMissionsFormWrap: any;

  blob: any;
  showPDFViewModal: boolean;
}
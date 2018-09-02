import {
  WaybillClosedInfoDataType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-closed.h';

export type PropsWaybillClosedInfo = {
  infoData: WaybillClosedInfoDataType;

  handleClose: Function;
  loadAllWaybillCard: Function;
};

export type StateWaybillClosedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
  infoData: WaybillClosedInfoDataType;
};

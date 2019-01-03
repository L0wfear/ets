import {
  WaybillClosedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';
import { WaybillType } from 'redux-main/trash-actions/waybill/@types/promise.h';

export type PropsWaybillClosedInfo = {
  infoData: WaybillClosedInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;
  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillClosedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

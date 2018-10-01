import {
  WaybillClosedInfoDataType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';
import { WaybillType } from 'redux-main/trash-actions/waybill/@types/promise.h';

export type PropsWaybillClosedInfo = {
  infoData: WaybillClosedInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;
  handleClose: Function;
  loadAllWaybillCard: Function;
};

export type StateWaybillClosedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

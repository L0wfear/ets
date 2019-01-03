import {
  WaybillCompletedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';
import { WaybillType } from 'redux-main/trash-actions/waybill/@types/promise.h';

export type PropsWaybillCompletedInfo = {
  infoData: WaybillCompletedInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;

  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillCompletedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

import {
  WaybillInProgressInfoDataType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';
import { WaybillType } from 'redux-main/trash-actions/waybill/@types/promise.h';

export type PropsWaybillInProgressInfo = {
  infoData: WaybillInProgressInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;

  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillInProgressInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

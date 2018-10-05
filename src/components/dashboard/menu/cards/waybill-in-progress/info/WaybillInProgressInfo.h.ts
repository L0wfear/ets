import {
  WaybillInProgressInfoDataType,
  WaybillInProgressItemsSubItemsType,
} from 'components/dashboard/redux/modules/dashboard/@types/waibill-in-progress.h';
import { WaybillType } from 'redux/trash-actions/waybill/@types/promise.h';

export type PropsWaybillInProgressInfo = {
  infoData: WaybillInProgressInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;

  handleClose: Function;
  loadAllWaybillCard: Function;
};

export type StateWaybillInProgressInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
  infoDataGroupByDate: {
    [index: string]: WaybillInProgressItemsSubItemsType[];
  };
  infoData: WaybillInProgressInfoDataType;
}
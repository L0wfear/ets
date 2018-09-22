import {
  WaybillCompletedInfoDataType,
  WaybillCompletedItemsSubItemsType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/waibill-completed.h';
import { WaybillType } from 'redux-main/trash-actions/waybill/@types/promise.h';

export type PropsWaybillCompletedInfo = {
  infoData: WaybillCompletedInfoDataType;
  getWaybillById: (id: number) => Promise<WaybillType>;

  handleClose: Function;
  loadAllWaybillCard: Function;
};

export type StateWaybillCompletedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
  infoDataGroupByDate: {
    [index: string]: WaybillCompletedItemsSubItemsType[];
  };
  infoData: WaybillCompletedInfoDataType;
}
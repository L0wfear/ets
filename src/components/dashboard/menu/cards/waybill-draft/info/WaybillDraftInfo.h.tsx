import {
  WaybillDraftItemsType,
  WaybillDraftItemsSubItemsType,
} from 'components/dashboard/redux/modules/dashboard/@types/waibill-draft.h';
import { WaybillType } from 'redux/trash-actions/waybill/@types/promise.h';

export type PropsWaybillDraftInfo = {
  infoData: WaybillDraftItemsType;
  getWaybillById: (id: number) => Promise<WaybillType>;

  handleClose: Function;
  loadAllWaybillCard: Function;
};

export type StateWaybillDraftInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
  infoDataGroupByDate: {
    [index: string]: WaybillDraftItemsSubItemsType[];
  };
  infoData: WaybillDraftItemsType;
}

import {
  WaybillDraftItemsType,
  WaybillDraftItemsSubItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-draft.h';

export type PropsWaybillDraftInfo = {
  infoData: WaybillDraftItemsType;

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

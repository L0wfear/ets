import {
  WaybillCompletedInfoDataType,
  WaybillCompletedItemsSubItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-completed.h';

export type PropsWaybillCompletedInfo = {
  infoData: WaybillCompletedInfoDataType;

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
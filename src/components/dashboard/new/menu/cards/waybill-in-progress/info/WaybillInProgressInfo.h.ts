import {
  WaybillInProgressInfoDataType,
  WaybillInProgressItemsSubItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/waibill-in-progress.h';

export type PropsWaybillInProgressInfo = {
  infoData: WaybillInProgressInfoDataType;

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
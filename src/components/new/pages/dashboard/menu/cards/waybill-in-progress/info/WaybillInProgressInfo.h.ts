import {
  WaybillInProgressInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-in-progress.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type PropsWaybillInProgressInfo = {
  infoData: WaybillInProgressInfoDataType;
  dispatch: EtsDispatch;

  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillInProgressInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

import {
  WaybillCompletedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-completed.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type PropsWaybillCompletedInfo = {
  infoData: WaybillCompletedInfoDataType;
  dispatch: EtsDispatch;

  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillCompletedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

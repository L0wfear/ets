import {
  WaybillClosedInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-closed.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type PropsWaybillClosedInfo = {
  infoData: WaybillClosedInfoDataType;

  dispatch: EtsDispatch;
  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillClosedInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

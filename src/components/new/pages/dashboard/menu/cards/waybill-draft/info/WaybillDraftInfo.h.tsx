import {
  WaybillDraftItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type PropsWaybillDraftInfo = {
  infoData: WaybillDraftItemsType;
  dispatch: EtsDispatch;

  handleClose: any;
  loadAllWaybillCard: any;
};

export type StateWaybillDraftInfo = {
  showWaybillFormWrap: boolean;
  elementWaybillFormWrap: any;
};

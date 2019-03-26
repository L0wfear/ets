import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { IStateInspectPgmBase } from '../pgm_base/@types/inspect_pgm_base';

export type TypeOfInspect = 'autobase' | 'pgm_base' | 'container';

export type IStateInspect = {
  inspectAutobase: IStateInspectAutobase;
  inspectPgmBase: IStateInspectPgmBase;
};

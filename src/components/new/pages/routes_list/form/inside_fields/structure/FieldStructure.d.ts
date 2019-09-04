import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type StateFieldStructure = {
  STRUCTURE_OPTIONS: any[];
};

export type StatePropsFieldStructure = {
  sessionStructures: InitialStateSession['userData']['structures'];
  userStructureId: InitialStateSession['userData']['structure_id'];
};

export type DispatchPropsFieldStructure = {
  dispatch: EtsDispatch;
};

export type OwnPropsFieldStructure = {
  value: number | void;
  name: string | null;
  disabled: boolean;
  error: string;
  page: string;
  path: string;
  onChange: (obj: { [key: string]: any }) => any;
};

export type PropsFieldStructure = (
  StatePropsFieldStructure
  & DispatchPropsFieldStructure
  & OwnPropsFieldStructure
);

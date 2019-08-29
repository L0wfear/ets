import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type StateFieldTechnicalOperation = {
  TECHNICAL_OPERATION_OPTIONS: any[];
};

export type StatePropsFieldTechnicalOperation = {};
export type DispatchPropsFieldTechnicalOperation = {
  dispatch: EtsDispatch,
};

export type OwnPropsFieldTechnicalOperation = {
  value: number | void;
  name: string | void;
  disabled: boolean;
  error: string;
  onChange: (obj: { [key: string]: any }) => any;
  page: string;
  path: string;
};

export type PropsFieldTechnicalOperation = (
  StatePropsFieldTechnicalOperation
  & DispatchPropsFieldTechnicalOperation
  & OwnPropsFieldTechnicalOperation
);

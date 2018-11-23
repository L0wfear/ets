export type StateFieldTechnicalOperation = {
  TECHNICAL_OPERATION_OPTIONS: any[];
};

export type StatePropsFieldTechnicalOperation = {};
export type DispatchPropsFieldTechnicalOperation = {
  getTechnicalOperations: () => Promise<any>;
};

export type OwnPropsFieldTechnicalOperation = {
  value: number | void;
  name: string | void;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;
  page: string;
  path: string;
};

export type PropsFieldTechnicalOperation = (
  StatePropsFieldTechnicalOperation
  & DispatchPropsFieldTechnicalOperation
  & OwnPropsFieldTechnicalOperation
);

type IOneHeadTableMetaStyle = {
  minWidth?: number | string;
  maxWidth?: number | string;
  backgroundColor?: string | void;
};

type IOneHeadTableMetaOtherProps = {
  className?: string | void;
};

type styleFunc = (numRow: number | string, row: Array<any>, errors: Array<any>) => IOneHeadTableMetaStyle | void;
type otherPropsFunc = (numRow: number | string, row: Array<any>, errors: Array<any>) => IOneHeadTableMetaOtherProps | void;

type IOneTableOrigin = {
  key: string;
  title: string;
  style: styleFunc;
  otherProps?: otherPropsFunc;
};
type IOneTableMeta = {
  tabIncludes?: Array<string>;
} & IOneTableOrigin;

export type ITableMetaInfo = Array<IOneTableMeta>;
export type ITableMetaPercent = Array<IOneTableOrigin>;

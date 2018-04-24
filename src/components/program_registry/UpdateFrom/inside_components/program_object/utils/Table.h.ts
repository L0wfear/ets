interface IOneHeadTableMetaStyle {
  minWidth?: number | string;
  maxWidth?: number | string;
  backgroundColor?: string | void;
}

interface IOneHeadTableMetaOtherProps {
  className?: string | void;
}

type styleFunc = (numRow: number | string, row: any[], errors: any[]) => IOneHeadTableMetaStyle | void;
type otherPropsFunc = (numRow: number | string, row: any[], errors: any[]) => IOneHeadTableMetaOtherProps | void;

interface IOneTableOrigin {
  key: string;
  title: string;
  style: styleFunc;
  otherProps?: otherPropsFunc;
}
interface IOneTableMeta extends IOneTableOrigin {
  tabIncludes?: string[];
}

export type ITableMetaInfo = IOneTableMeta[];
export type ITableMetaPercent = IOneTableOrigin[];

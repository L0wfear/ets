interface IOneHeadTableMetaStyle {
  minWidth?: number | string;
  maxWidth?: number | string;
  backgroundColor?: string | void;
}

type styleFunc = (numRow: number | string, row: any[], errors: any[]) => IOneHeadTableMetaStyle | void;

interface IOneTableOrigin {
  key: string;
  title: string;
  style: styleFunc;
}
interface IOneTableMeta extends IOneTableOrigin {
  tabIncludes?: string[];
}

export type ITableMetaInfo = IOneTableMeta[];
export type ITableMetaPercent = IOneTableOrigin[];

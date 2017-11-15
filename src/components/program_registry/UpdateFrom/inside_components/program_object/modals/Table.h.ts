interface IOneHeadTableMetaStyle {
  minWidth?: number | string;
  maxWidth?: number | string;
  backgroundColor?: string | void;
}

type styleFunc = (num: number | string, arr: any[]) => IOneHeadTableMetaStyle | void;

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

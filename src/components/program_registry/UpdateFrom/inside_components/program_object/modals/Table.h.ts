interface IOneHeadTableMetaStyle {
  minWidth?: number | string;
  maxWidth?: number | string;
  backgroundColor: string;
}

type styleFunc = (num: number | string, arr: any[]) => IOneHeadTableMetaStyle;

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

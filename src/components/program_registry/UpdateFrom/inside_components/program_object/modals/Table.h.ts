interface IOneHeadTableMetaStyle {
  minWidth?: number | string;
  maxWidth?: number | string;
}

interface IOneTableOrigin {
  key: string;
  title: string;
  style?: IOneHeadTableMetaStyle;
}
interface IOneTableMeta extends IOneTableOrigin {
  tabIncludes?: string[];
}

export type ITableMetaInfo = IOneTableMeta[];
export type ITableMetaPercent = IOneTableOrigin[];

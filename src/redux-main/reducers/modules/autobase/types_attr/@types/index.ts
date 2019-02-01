import { TypesAttr } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTypesAttr = (typesAttrOld: TypesAttr, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
export type AutobaseUpdateTypesAttr = (typesAttrOld: TypesAttr, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetTypesAttr = () => Promise<any>;

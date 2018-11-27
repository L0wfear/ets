import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateSparePart = (sparePartOld: SparePart & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateSparePart = (sparePartOld: SparePart, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

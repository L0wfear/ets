import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateEngineType = (engineTypeOld: EngineType & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateEngineType = (engineTypeOld: EngineType, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetEngineType = () => (
  Promise<any>
);

import { PropulsionType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreatePropulsionType = (propulsionTypeOld: PropulsionType & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdatePropulsionType = (propulsionTypeOld: PropulsionType, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetPropulsionType = () => (
  Promise<any>
);

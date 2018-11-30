import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateRoadAccident = (roadAccidentOld: RoadAccident & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateRoadAccident = (roadAccidentOld: RoadAccident, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRoadAccidentType = () => Promise<any>;

import { RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateRoadAccidentCause = (roadAccidentCauseOld: RoadAccidentCause & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateRoadAccidentCause = (roadAccidentCauseOld: RoadAccidentCause, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRoadAccidentCauseType = () => Promise<any>;

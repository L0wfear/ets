import {
  ICoordindate,
  IDrawObjectList,
} from 'components/ui/input/map/@types/MapWrap.h';

export type IMackType = IMaskProps;

export interface IMaskProps {
  SELECTABLE?: number;
  ENABLED?: number;
  IDLE?: number;
}

export interface IAnsFindIndexDrawObjectById {
  index: number;
  isFind: boolean;
}

export type IGetNextStateForFeatureByState = (state: number, mask?: IMackType) => number;
export type ICheckRouteHasObjectByBegCoor = (drawObjectList: IDrawObjectList, coordinates: ICoordindate[]) => boolean;
export type IFindIndexDrawObjectById = (drawObjectList: IDrawObjectList, id: number) => IAnsFindIndexDrawObjectById;

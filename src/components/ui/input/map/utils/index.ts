import {
  IGetNextStateForFeatureByState,
  ICheckRouteHasObjectByBegCoor,
  IFindIndexDrawObjectById,
} from 'components/ui/input/map/utils/index.h';

import { polyState } from 'constants/polygons.js';

/**
 * Возвращает новое состояние точки. Вторым параметром можно задать другую маску polyState
 * @param state is state of object
 * @param mask switch case another equal
 */
export const getNextStateForFeatureByState: IGetNextStateForFeatureByState = (state, mask = {}) => {
  switch (state) {
    case polyState.SELECTABLE: return mask.SELECTABLE || polyState.ENABLED;
    case polyState.ENABLED: return mask.ENABLED || polyState.IDLE;
    case polyState.IDLE: return mask.IDLE || polyState.SELECTABLE;
    default: return 0;
  }
};

/**
 * Проверяет не является ли новая линия дублем уже существующей
 * @param drawObjectList Массив нарисованных геометрий
 * @param coordinates Координаты новой lineString [beg[], end[]], beg = end = []
 */
export const checkRouteHasObjectByBegCoor: ICheckRouteHasObjectByBegCoor = (drawObjectList, coordinates) => {
  const [[coorBegX, coorBegY]] = coordinates;

  return drawObjectList.some(({ begin: { x_msk, y_msk } }) => {
    return x_msk === coorBegX && y_msk === coorBegY;
  });
};

/**
 * Поиск индекса геометрии по id в массиве нарисованных геометрий
 * @param drawObjectList Массив нарисованных геометрий
 * @param id id геометрии, индекс которой ищется
 */
export const findIndexDrawObjectById: IFindIndexDrawObjectById = (drawObjectList, id) => {
  const index = drawObjectList.findIndex(({id: id_do }) => id_do === id);
  return {
    index,
    isFind: index !== -1,
  };
};

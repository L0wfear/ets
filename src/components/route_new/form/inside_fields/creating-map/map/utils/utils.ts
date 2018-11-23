/**
 * Проверяет не является ли новая линия дублем уже существующей
 * @param drawObjectList Массив нарисованных геометрий
 * @param coordinates Координаты новой lineString [beg[], end[]], beg = end = []
 */
export const checkRouteHasObjectLineByBegCoor = (drawObjectList, coordinates) => {
  const [[coorBegX, coorBegY]] = coordinates;

  return drawObjectList.some(({ begin: { x_msk, y_msk } }) => {
    return x_msk === coorBegX && y_msk === coorBegY;
  });
};

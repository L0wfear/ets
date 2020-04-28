import * as cx from 'classnames';

/**
 * получние класса активной опции
 * @param props значения отображений трёх активных статусов
 */
export const getActiveClassName = (props) => (
  cx(
    'legen_option',
    'car_legend-active',
    {
      off: !props.in_move && !props.stop && !props.parking,
    },
  )
);

/**
 * получение класса для опции легенды
 * @param props пропсы
 * @param type имя пропса, которое отвечает за активность
 */
export const getClassNameByType = (props, type) => {
  return (cx('legen_option', {
    off: !props[type] && type !== 'not_in_map',
  }));
};

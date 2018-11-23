// тут задаются стили линий при отображении геообъектов и ТС на карте
export const polyState = {
  ENABLE: 1,
  SELECTED: 2,
  SELECTED_IDLING: 3,
};

export const linesState = {
  SELECTED: polyState.SELECTED,
  SELECTED_IDLING: polyState.SELECTED_IDLING,
};

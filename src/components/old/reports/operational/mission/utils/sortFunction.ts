import { getDelForUnitRender } from 'components/old/reports/operational/mission/utils/main';

export const sortFunc = (a, b) => {
  const first_a = Number(a.traveled / getDelForUnitRender(a.route_check_unit));
  const second_a = Number(a.traveled_high_speed / getDelForUnitRender(a.route_check_unit));
  const first_b = Number(b.traveled / getDelForUnitRender(b.route_check_unit));
  const second_b = Number(b.traveled_high_speed / getDelForUnitRender(b.route_check_unit));

  const change = first_a - first_b;
  if (change === 0) {
    return second_a - second_b;
  }
  return change;
};

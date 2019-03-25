import permissions from 'components/reports/operational/fuel_cards_report/config-data/permissions';
import component from 'components/reports/operational/fuel_cards_report/config-data/components';

export default {
  path: '/fuel_cards_report',
  title: 'Отчёт по топливным картам',
  entyity: 'fuel_cards_report',
  noDotList: false,
  component,
  permissions,
};

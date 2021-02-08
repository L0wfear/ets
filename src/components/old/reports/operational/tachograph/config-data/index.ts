import permissions from 'components/old/reports/operational/tachograph/config-data/permissions';
import component from 'components/old/reports/operational/tachograph/config-data/components';

export default {
  path: '/tachograph',
  title: 'Отчет по тахографам',
  entyity: 'tachograph_report',

  component,
  permissions,
};

import permissions from 'components/old/reports/operational/penalties/config-data/permissions';
import component from 'components/old/reports/operational/penalties/config-data/components';

export default {
  path: '/penalties',
  title: 'Отчет по штрафам',
  entyity: 'penalties_report',

  component,
  permissions,
};

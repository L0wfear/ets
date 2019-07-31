import permissions from 'components/reports/operational/long_repair/config-data/permissions';
import component from 'components/reports/operational/long_repair/config-data/components';

export default {
  path: '/long-repair',
  title: 'Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне',
  entyity: 'autobase_long_repair_report',
  noDotList: false,
  component,
  permissions,
};

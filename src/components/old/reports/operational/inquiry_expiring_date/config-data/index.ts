import permissions from 'components/old/reports/operational/inquiry_expiring_date/config-data/permissions';
import component from 'components/old/reports/operational/inquiry_expiring_date/config-data/components';

export default {
  path: '/inquiry-expiring-date',
  title: 'Перечень справок, по которым подходит дата окончания действия',
  entyity: 'autobase_inquiry_expiring_date_report',
  noDotList: false,
  component,
  permissions,
};

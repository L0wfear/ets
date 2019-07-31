import permissions from 'components/reports/operational/track_events/config-data/permissions';
import component from 'components/reports/operational/track_events/config-data/components';

export default {
  path: '/track-events-reports',
  title: 'Отчет по возможным сливам топлива',
  entyity: 'track_events_report',
  noDotList: false,
  component,
  permissions,
};

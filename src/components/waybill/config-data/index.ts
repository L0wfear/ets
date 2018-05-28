import permissions from 'components/waybill/config-data/permissions';
import components from 'components/waybill/config-data/components';

export default {
  path: '/waybill-journal',
  title: 'Путевые листы',
  entyity: 'waybill',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};

import permissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import component from 'components/new/pages/inspection/autobase/_config_data/components';

export default {
  path: '/inspection/autobase',
  routePath: '/inspection/autobase/:id?/:type?',
  title: 'Обустройство автобаз',
  isNewRegistry: true,
  entyity: 'inspect.autobase',
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};

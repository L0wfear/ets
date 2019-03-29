import permissions from 'components/new/pages/inspection/container/_config_data/permissions';
import component from 'components/new/pages/inspection/container/_config_data/components';

export default {
  path: '/inspection/container',
  routePath: '/inspection/container/',
  title: 'container',
  isNewRegistry: true,
  entyity: 'inspect.container',
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};

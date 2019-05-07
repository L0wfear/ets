import config from 'config';

export default {
  path: `${config.admin}`,
  title: 'Администрирование сайта',
  entyity: 'administration',
  noHash: true,
  noDotList: true,
  noRoute: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  permissions: {
    list: 'administration',
  },
};

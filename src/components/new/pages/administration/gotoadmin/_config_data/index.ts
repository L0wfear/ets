import config from 'config';
import { ConfigPageData } from 'components/@next/@types/config_data';

const gotoadmin_page_config: ConfigPageData = {
  path: `${config.admin}`,
  title: 'Администрирование сайта',
  entyity: 'administration',
  noHash: true,
  noRoute: true,
  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  permissions: {
    list: 'administration',
  },
};

export default gotoadmin_page_config;

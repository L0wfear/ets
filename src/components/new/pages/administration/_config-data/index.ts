import { getChildrenData } from 'utils/routes/getChildrenData';

import gotoadmin from 'components/new/pages/administration/gotoadmin/_config_data';
import services from 'components/new/pages/administration/services/_config-data';
import { ConfigParentData } from 'components/@next/@types/config_data';

const children: ConfigParentData['children'] = {
  gotoadmin,
  services,
};

export default {
  title: 'Администрирование',
  children,
  ...getChildrenData(children),
  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
};

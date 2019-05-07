import { getChildrenData } from 'utils/routes/getChildrenData';

import gotoadmin from 'components/new/pages/administration/gotoadmin/_config_data';
import services from 'components/new/pages/administration/services/_config-data';

const children = {
  gotoadmin,
  services,
};

export default {
  title: 'Администрирование',
  children,
  ...getChildrenData(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
};

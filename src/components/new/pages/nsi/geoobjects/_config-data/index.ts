import { getChildrenData } from 'utils/routes/getChildrenData';

import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';
import odhList from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data';

const children = {
  dtList,
  odhList,
};

export default {
  title: 'Геообъекты',
  children,
  ...getChildrenData(children),
};

import { getChildrenData } from 'utils/routes/getChildrenData';

import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';
import odhList from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data';

import sspList from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data';
import mspList from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data';

const children = {
  dtList,
  odhList,
  sspList,
  mspList,
};

export default {
  title: 'Геообъекты',
  children,
  ...getChildrenData(children),
};

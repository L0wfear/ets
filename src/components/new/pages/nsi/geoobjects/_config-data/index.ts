import { getChildrenData } from 'utils/routes/getChildrenData';

import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';

const children = {
  dtList,
};

export default {
  title: 'Геообъекты',
  children,
  ...getChildrenData(children),
};

import { getChildrenData } from 'utils/routes/getChildrenData';

import cars from 'components/new/pages/nsi/cars/_config-data';
import geoobjects from 'components/new/pages/nsi/geoobjects/_config-data';

const children = {
  cars,
  geoobjects,
};

export default {
  title: 'НСИ new',
  children,
  ...getChildrenData(children),
};

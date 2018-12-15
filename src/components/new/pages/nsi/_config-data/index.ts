import { getChildrenData } from 'utils/routes/getChildrenData';

import cars from 'components/new/pages/nsi/cars/_config-data';

const children = {
  cars,
};

export default {
  title: 'НСИ new',
  children,
  ...getChildrenData(children),
};

import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import cars from 'components/new/pages/nsi/cars/_config-data';

const children = {
  cars,
};

export default {
  title: 'НСИ new',
  children,
  permissions: getChildrenPermissions(children),
};

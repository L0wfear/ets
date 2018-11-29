import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import carFuncTypes from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data';

const children = {
  carFuncTypes,
};

export default {
  title: 'Транспортные средства',
  children,
  permissions: getChildrenPermissions(children),
};

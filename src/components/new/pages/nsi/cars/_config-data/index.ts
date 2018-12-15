import { getChildrenData } from 'utils/routes/getChildrenData';

import carFuncTypes from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data';

const children = {
  carFuncTypes,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};

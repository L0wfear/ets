import { getChildrenData } from 'utils/routes/getChildrenData';

import carFuncTypes from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data';
import typesAttr from 'components/new/pages/nsi/cars/pages/types-attr/_config-data';

const children = {
  carFuncTypes,
  typesAttr,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};

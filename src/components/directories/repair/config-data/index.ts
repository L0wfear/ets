import { getChildrenData } from 'utils/routes/getChildrenData';

import contractor from 'components/directories/repair/contractor/config-data';
import stateProgram from 'components/directories/repair/state_program/config-data';
import objectProperty from 'components/directories/repair/object_property/config-data';

const children = {
  contractor,
  stateProgram,
  objectProperty,
};

export default {
  title: 'Планирование работ по техническому содержанию объектов',
  children,
  ...getChildrenData(children),
};

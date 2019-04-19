import { getChildrenData } from 'utils/routes/getChildrenData';

import contractor from 'components/directories/repair/contractor/config-data';
import stateProgram from 'components/directories/repair/state_program/config-data';
import objectPropertyList from 'components/new/pages/nsi/repair/pages/object_property/_config-data';

const children = {
  contractor,
  stateProgram,
  objectPropertyList,
};

export default {
  title: 'Планирование работ по техническому содержанию объектов',
  children,
  ...getChildrenData(children),
};

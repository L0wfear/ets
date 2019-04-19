import { getChildrenData } from 'utils/routes/getChildrenData';

import contractorList from 'components/new/pages/nsi/repair/pages/contractor/_config-data';
import stateProgram from 'components/directories/repair/state_program/config-data';
import objectPropertyList from 'components/new/pages/nsi/repair/pages/object_property/_config-data';

const children = {
  contractorList,
  stateProgram,
  objectPropertyList,
};

export default {
  title: 'Планирование работ по техническому содержанию объектов',
  children,
  ...getChildrenData(children),
};

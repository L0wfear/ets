import { getChildrenData } from 'utils/routes/getChildrenData';

import contractorList from 'components/new/pages/nsi/repair/pages/contractor/_config-data';
import stateProgramList from 'components/new/pages/nsi/repair/pages/state_program/_config-data';
import objectPropertyList from 'components/new/pages/nsi/repair/pages/object_property/_config-data';

const children = {
  contractorList,
  stateProgramList,
  objectPropertyList,
};

export default {
  title: 'Планирование работ по техническому содержанию объектов',
  children,
  ...getChildrenData(children),
};

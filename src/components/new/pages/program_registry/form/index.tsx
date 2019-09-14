import * as React from 'react';

import { WithFormRegistrySearchProps, withFormRegistrySearchNew } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const ProgramRegistryFrom = React.lazy(() => (
  import(/* webpackChunkName: "programm_registry_switch" */ 'components/old/program_registry/ProgramRegistrySwitch')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<any>, any>({
  add_path: 'program_registry',
})(ProgramRegistryFrom);

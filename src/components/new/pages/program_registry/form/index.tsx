import * as React from 'react';

import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const ProgramRegistryFrom = React.lazy(() => (
  import(/* webpackChunkName: "programm_registry_switch" */ 'components/old/program_registry/ProgramRegistrySwitch')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<any>, any>({
  add_path: 'program_registry',
})(ProgramRegistryFrom);

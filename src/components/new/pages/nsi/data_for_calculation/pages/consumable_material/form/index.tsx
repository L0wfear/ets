import * as React from 'react';

import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const ConsumableMaterialFormContextReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "consumable_material_form" */ 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/ConsumableMaterialFormContext')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<ConsumableMaterial>, ConsumableMaterial>({
  add_path: 'consumable_material',
})(ConsumableMaterialFormContextReactLazy);

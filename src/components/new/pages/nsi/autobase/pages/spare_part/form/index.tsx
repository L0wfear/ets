import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const SparePartFrom = React.lazy(() => (
  import(/* webpackChunkName: "spare_part_form" */ 'components/new/pages/nsi/autobase/pages/spare_part/form/SparePartForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<SparePart>, SparePart>({
  add_path: 'spare-part',
})(SparePartFrom);

import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';

const TachographForm = React.lazy(() => (
  import(/* webpackChunkName: "tachograph_form" */ 'components/new/pages/nsi/autobase/pages/tachograph/form/TachographForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<TachographListWithOuterProps>, TachographListWithOuterProps>({
  add_path: 'tachograph',
})(TachographForm);

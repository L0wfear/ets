import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';

const TachographPeriodicVerificationForm = React.lazy(() => (
  import(/* webpackChunkName: "tachograph_periodic_verification_form" */ 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form/TachographPeriodicVerificationForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Tachograph>, Tachograph>({
  add_path: 'tachograph_periodic_verification',
})(TachographPeriodicVerificationForm);

import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';

const TachographMetrologicalVerificationFrom = React.lazy(() => (
  import(/* webpackChunkName: "tachograph_metrological_verification_form" */ 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/form/TachographMetrologicalVerificationForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<TachographMetrologicalVerification>, TachographMetrologicalVerification>({
  add_path: 'tachograph_metrological_verification',
})(TachographMetrologicalVerificationFrom);

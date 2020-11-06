import * as React from 'react';
import withFormRegistryWithoutWithSearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistryWithoutWithSearch';

const RefillFormLazy = React.lazy(() => (
  import(/* webpackChunkName: "refill_form" */ 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/form/RefillForm')
));

export default withFormRegistryWithoutWithSearch(RefillFormLazy);

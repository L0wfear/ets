import * as React from 'react';

import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const ServicesFormReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "service_history" */ 'components/new/pages/administration/services/form/ServicesForm'),
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Service>, Service>({
  add_path: 'services',
  cant_create: true,
  search_which_need_to_remove: ['date_from', 'date_to', 'service_history_registry_page', 'service_history_registry_filters'],
})(ServicesFormReactLazy);

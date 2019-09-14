import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const TechMaintOrderFrom = React.lazy(() => (
  import(/* webpackChunkName: "tech_maint_order_form" */ 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/TechMaintenanceOrderForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<TechMaintOrder>, TechMaintOrder>({
  add_path: 'tech_maint_order',
})(TechMaintOrderFrom);

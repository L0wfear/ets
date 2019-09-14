import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/@types/technicalOperationRelations';

const ChangeRouteFormReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "change_route" */ 'components/new/pages/nsi/technical_operation_relations/form/change_route/ChangeRouteForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Partial<TechnicalOperationRelations>>, TechnicalOperationRelations>({
  add_path: 'change_route',
  cant_create: true,
  replace_uniqKey_on: 'asuods_id',
})(ChangeRouteFormReactLazy);

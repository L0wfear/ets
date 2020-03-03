import * as React from 'react';

// import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
// import { CarsConditionTableDefects } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

const CarsConditionTableDefectsForm = React.lazy(() => (
  import(/* webpackChunkName: "cars_condition_table_defects_form" */ 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/form/CarsConditionTableDefectsForm')
));

export default CarsConditionTableDefectsForm;

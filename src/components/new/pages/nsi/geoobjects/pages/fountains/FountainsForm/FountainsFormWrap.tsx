import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

const FountainsFrom = React.lazy(() => (
  import(/* webpackChunkName: "fountains_form" */ 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/FountainsForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Fountains>, Fountains>({
  add_path: 'fountains',
})(FountainsFrom);

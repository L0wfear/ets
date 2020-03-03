import * as React from 'react';

import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { WithFormRegistrySearchProps, withFormRegistrySearch, WithFormRegistrySearchAddPropsWithoutWithSerach } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

export const FuelCardsFormLazy = React.lazy(() => (
  import(/* webpackChunkName: "fuel_cards_form" */ 'components/new/pages/nsi/autobase/pages/fuel_cards/form/FuelCardsForm')
));

export const FuelCardsFormLazyWithoutWithSeacth = withSearch<WithFormRegistrySearchAddPropsWithoutWithSerach<Partial<FuelCard>>>(FuelCardsFormLazy);
export default withFormRegistrySearch<WithFormRegistrySearchProps<FuelCard>, FuelCard>({
  add_path: 'fueld_card',
})(FuelCardsFormLazy);

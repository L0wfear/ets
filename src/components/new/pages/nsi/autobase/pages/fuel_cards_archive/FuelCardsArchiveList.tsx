import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import FuelCardsFormLazy from 'components/new/pages/nsi/autobase/pages/fuel_cards/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/registry-config';

import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const FuelCardsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <>
        <Registry registryKey={registryKey} />
        <FuelCardsFormLazy registryKey={registryKey} />
      </>
    );
  },
);

export default withRegistry<FuelCard, OwnProps>(getToConfig(true, 'Архив топливных карт'))(FuelCardsList);

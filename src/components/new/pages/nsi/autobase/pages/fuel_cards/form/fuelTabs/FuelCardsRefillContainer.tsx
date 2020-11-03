/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TabBodyContainerStyled } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';
import RefillRegistryList from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/RefillRegistryList';
type Props = {
  showComponent: boolean;
};

const FuelCardsRefillContainer: React.FC<Props> = React.memo(
  (props) => {

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      <EtsBootstrap.Col md={12}>
        <RefillRegistryList 
          {...props}
        />
      </EtsBootstrap.Col>
    </TabBodyContainerStyled>;
  },
);

export default FuelCardsRefillContainer;

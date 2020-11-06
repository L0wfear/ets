/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TabBodyContainerStyled } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';
import RefillRegistryList from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/RefillRegistryList';
type Props = {
  showComponent: boolean;
  fuel_card_number: string;
};

const FuelCardsRefillContainer: React.FC<Props> = React.memo(
  (props) => {

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      <EtsBootstrap.Col md={12}>
        <RefillRegistryList 
          fuel_card_number={props.fuel_card_number}
        />
      </EtsBootstrap.Col>
    </TabBodyContainerStyled>;
  },
);

export default FuelCardsRefillContainer;

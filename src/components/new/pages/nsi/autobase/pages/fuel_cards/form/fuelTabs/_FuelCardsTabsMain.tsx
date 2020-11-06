/* eslint-disable no-tabs */
import FuelNavHeader from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelNavHeader';
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { vehicleTab } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';
import FuelCardsRefillContainer from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsRefillContainer';
import FuelCardsVehicleContainer from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsVehicleContainer';

const FuelCardsTabsMainStyled = styled.div`
`;

export type FuelCardsTabsMainProps = {
	page: string;
	path: string;
	isPermitted: boolean;
	isPermittedToUpdateCards: boolean;
} & Pick<PropsFuelCards, 'formErrors' | 'handleChange' | 'formState'>;

const FuelCardsTabsMain: React.FC<FuelCardsTabsMainProps> = React.memo(
  (props) => {

    const [ fuelActiveTabKey, setFuelActiveTabKey ] = React.useState(vehicleTab?.tabKey);

    const handleChangeActiveNavTab = React.useCallback((tabKey) => {
      setFuelActiveTabKey(tabKey);
    }, [setFuelActiveTabKey]);

    return <FuelCardsTabsMainStyled>
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={12}>
          <FuelNavHeader
            isPermitted={true}
            activeTabKey={fuelActiveTabKey}
            handleTabChange={handleChangeActiveNavTab}
            errors={props.formErrors}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <FuelCardsVehicleContainer
            showComponent={fuelActiveTabKey === 'vehicle'}
            page={props.page}
            path={props.path}
            isPermitted={props.isPermitted}
            isPermittedToUpdateCards={props.isPermittedToUpdateCards}
            formErrors={props.formErrors}
            handleChange={props.handleChange}
            formState={props.formState}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <FuelCardsRefillContainer
            showComponent={fuelActiveTabKey === 'refill'}
            fuel_card_number={props.formState.number}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>

    </FuelCardsTabsMainStyled>;
  },
);

export default FuelCardsTabsMain;

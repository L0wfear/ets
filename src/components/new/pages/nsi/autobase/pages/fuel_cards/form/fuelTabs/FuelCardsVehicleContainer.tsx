/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TabBodyContainerStyled } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';
import FuelCardsToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/vehicle-block/FuelCardsToVehicleBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { FuelCardsTabsMainProps } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/_FuelCardsTabsMain';

type Props = {
  showComponent: boolean;
} & Partial<FuelCardsTabsMainProps>;

const FuelCardsVehicleBlock: any = onChangeWithKeys(
  FuelCardsToVehicleBlockComponent,
);

const FuelCardsVehicleContainer: React.FC<Props> = React.memo(
  (props) => {

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Row>
                <FuelCardsVehicleBlock
                  id="fuel_card_on_cars_id"
                  onChange={props.handleChange}
                  boundKeys="fuel_card_on_cars"
                  inputList={props.formState.fuel_card_on_cars || []}
                  origin_fuel_card_on_cars={props.formState.origin_fuel_card_on_cars || []}
                  outerValidate
                  errors={props.formErrors.fuel_card_on_cars}
                  fuelCardsId={props.formState.id}
                  selectField="customId"
                  modalKey={props.page}
                  page={props.page}
                  path={props.path}
                  isPermitted={props.isPermitted || props.isPermittedToUpdateCards}
                  isPermittedToUpdateCards={props.isPermittedToUpdateCards}
                  tableTitle="Привязанные транспортные средства"
                />
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    </TabBodyContainerStyled>;
  },
);

export default FuelCardsVehicleContainer;

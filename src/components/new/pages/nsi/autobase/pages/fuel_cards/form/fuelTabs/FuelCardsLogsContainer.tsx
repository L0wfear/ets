/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TabBodyContainerStyled } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';
import LogsRegistryList from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/logs_block/LogsRegistryList';
type Props = {
  showComponent: boolean;
  id: number;
};

const FuelCardsLogsContainer: React.FC<Props> = React.memo((props) => {
  const [isDataAdded, setIsDataAdded] = React.useState(false);
  return (
    <TabBodyContainerStyled showComponent={props.showComponent}>
      <EtsBootstrap.Col md={12}>
        {
          (props.showComponent || isDataAdded)
          && (
            <LogsRegistryList
              id={props.id}
              setIsDataAdded={setIsDataAdded}
            />
          )
        }
      </EtsBootstrap.Col>
    </TabBodyContainerStyled>
  );
});

export default FuelCardsLogsContainer;

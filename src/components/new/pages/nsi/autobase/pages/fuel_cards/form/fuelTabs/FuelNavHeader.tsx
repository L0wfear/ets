import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { fuelCardsFormTabKey, refillTab } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelCardsFormTabConfig';

import FuelNavLink from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/FuelNavLink';
import { checkErrorsIntoTab } from 'components/old/waybill/form/waybillFormTabConfig';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

type OwnProps = {
  isPermitted: boolean;
  activeTabKey: string;
  handleTabChange: (tabKey: string) => any;
  errors: PropsFuelCards['formErrors'];
  formState: FuelCard;
};
type Props = OwnProps;

const FuelNavHeader: React.FC<Props> = React.memo(
  (props) => {
    const activeTabKey = props.activeTabKey;

    return (
      <EtsBootstrap.Nav
        bsStyle="tabs"
        id="refs-fuel-cards-tabs"
        activeKey={activeTabKey}
      >
        {
          fuelCardsFormTabKey.map(({ tabKey: tabKeyScheme, title, errorsFieldList, }) => {
            const isActive = activeTabKey === tabKeyScheme ? true : false;
            const tabHasErrors = checkErrorsIntoTab(props.errors, errorsFieldList);
            const showRefillTabIntoNav = Boolean(tabKeyScheme === refillTab.tabKey && props.formState.source_type_id !== 1);

            return (
              <React.Fragment key={tabKeyScheme} >
                <FuelNavLink
                  isActive={isActive}
                  title={title}
                  tabKey={tabKeyScheme}
                  handleTabChange={props.handleTabChange}
                  tabHasErrors={tabHasErrors}
                  showTabIntoNav={ tabKeyScheme === refillTab.tabKey ? showRefillTabIntoNav : true}
                />
              </React.Fragment>
            );
          })
        }
      </EtsBootstrap.Nav>
    );
  },
);

export default FuelNavHeader;

import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { fuelKindFormTabKey, checkErrorsIntoTab } from 'components/old/waybill/form/waybillFormTabConfig';
import FuelNavLink from 'components/old/waybill/form/fuelTabs/FuelNavLink';
import { WaybillProps } from 'components/old/waybill/WaybillForm';

type OwnProps = {
  isPermitted: boolean;
  activeTabKey: string;
  handleTabChange: (tabKey: string) => any;
  errors: WaybillProps['formErrors'];
  isGasKind: boolean;
  isFuelKind: boolean;
  isElectricalKind: boolean;
};
type Props = OwnProps;

const FuelNavHeader: React.FC<Props> = React.memo(
  (props) => {
    const activeTabKey = props.activeTabKey;

    return (
      <EtsBootstrap.Nav
        bsStyle="tabs"
        id="refs-fuel-kind-tabs"
        activeKey={activeTabKey}
      >
        {
          fuelKindFormTabKey.map(({ tabKey: tabKeyScheme, title, errorsFieldList, showTabIntoNavFlagKey, }) => {
            const isActive = activeTabKey === tabKeyScheme ? true : false;
            const tabHasErrors = checkErrorsIntoTab(props.errors, errorsFieldList);
            const showTabIntoNav = showTabIntoNavFlagKey && props?.[showTabIntoNavFlagKey];
            
            return (
              <React.Fragment key={tabKeyScheme} >
                <FuelNavLink
                  isActive={isActive}
                  title={title}
                  tabKey={tabKeyScheme}
                  handleTabChange={props.handleTabChange}
                  tabHasErrors={tabHasErrors}
                  showTabIntoNav={showTabIntoNav}
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

import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import fuelKindFormTabKey from 'components/old/waybill/form/waybillFormTabConfig';
import FuelNavLink from 'components/old/waybill/form/fuelTabs/FuelNavLink';

type OwnProps = {
  isPermitted: boolean;
  activeTabKey: string;
  handleTabChange: (tabKey: string) => any;
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
          fuelKindFormTabKey.map(({ tabKey: tabKeyScheme, title }) => {
            const isActive = activeTabKey === tabKeyScheme ? true : false;
            
            return (
              <React.Fragment key={tabKeyScheme} >
                <FuelNavLink
                  isActive={isActive}
                  title={title}
                  tabKey={tabKeyScheme}
                  handleTabChange={props.handleTabChange}
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

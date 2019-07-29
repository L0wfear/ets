import * as React from 'react';
import {get} from 'lodash';
import { isNullOrUndefined } from 'util';
import carFormTabKey from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import CarFormLink from './CarFormLink';
import CarFormLinkNavDropdown from './CarFormLinkNavDropdown';

type CarFormBodyHeaderOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyHeaderProps = (
  CarFormBodyHeaderOwnProps
);

const CarFormBodyHeader: React.FC<CarFormBodyHeaderProps> = (props) => {
  const activeTabKey = get(props, 'match.params.tabKey', null);

  return (
    <EtsBootstrap.Nav
      bsStyle="tabs"
      id="refs-car-tabs"
      activeKey={activeTabKey}
    >
      {
        carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
          const isActive = activeTabKey === tabKeyScheme ? true : false;
          if ('children' in other) {
            const isActiveChildren = get(other, 'children', []).find((elem) => elem.tabKey === activeTabKey);
            return (
              <EtsBootstrap.NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title} active={!isNullOrUndefined(isActiveChildren) ? true : false}>
                {
                  other.children.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                    <CarFormLinkNavDropdown
                      isActive={isActive}
                      tabKey={tabKeyChildScheme}
                      title={titleChild}
                    />
                  ))
                }
              </EtsBootstrap.NavDropdown>
            );
          }
          return (
            <React.Fragment key={tabKeyScheme} >
              <CarFormLink
                isActive={isActive}
                tabKey={tabKeyScheme}
                title={title}
              />
            </React.Fragment>
          );
        })
      }
    </EtsBootstrap.Nav>
  );
};

export default CarFormBodyHeader;

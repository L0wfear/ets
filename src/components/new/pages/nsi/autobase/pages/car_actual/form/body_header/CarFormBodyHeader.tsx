import * as React from 'react';
import { isNullOrUndefined } from 'util';
import carFormTabKey from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import CarFormLink from './CarFormLink';
import CarFormLinkNavDropdown from './CarFormLinkNavDropdown';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type OwnProps = {
  isPermitted: boolean;
  noPassport: boolean;
};
type Props = (
  OwnProps
) & WithSearchProps;

const CarFormBodyHeader: React.FC<Props> = React.memo(
  (props) => {
    const activeTabKey = props.match.params.tabKey;
    const { noPassport } = props;

    return (
      <EtsBootstrap.Nav
        bsStyle="tabs"
        id="refs-car-tabs"
        activeKey={activeTabKey}
      >
        {
          carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
            const isActive = activeTabKey === tabKeyScheme;
            if ('children' in other) {
              const isActiveChildren = other.children.find((elem) => elem.tabKey === activeTabKey);
              const carFormTabKeyChildren = noPassport
                ? other.children.filter((el) => el.tabKey !== 'passport_info')
                : other.children;
              return (
                <EtsBootstrap.NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title} active={!isNullOrUndefined(isActiveChildren)}>
                  {
                    carFormTabKeyChildren.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
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
  },
);

export default withSearch<OwnProps>(CarFormBodyHeader);

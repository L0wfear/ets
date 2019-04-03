import * as React from 'react';
import { Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import carFormTabKey, { mainInfo, findSelectedTabKeyComponent } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';

type CarFormBodyHeaderOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyHeaderProps = (
  CarFormBodyHeaderOwnProps
  & WithSearchProps
);

const CarFormBodyHeader: React.FC<CarFormBodyHeaderProps> = (props) => {
  const {
    match,
  } = props;

  const tabKeyOwn = match.params.tabKey;

  React.useEffect(
    () => {
      if (!findSelectedTabKeyComponent(tabKeyOwn)) {
        props.setParams({
          tabKey: mainInfo.tabKey,
        });
      }
    },
    [tabKeyOwn],
  );

  const setTabKeyWrap = React.useCallback(
    (tabKeyNew) => {
      props.setParams({
        tabKey: tabKeyNew,
      });
    },
    [],
  );

  return (
    <Nav
      bsStyle="tabs"
      activeKey={tabKeyOwn}
      onSelect={setTabKeyWrap}
      id="refs-car-tabs"
    >
      {
        carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
          if ('children' in other) {
            return (
              <NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title}>
                {
                  other.children.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                    <MenuItem key={tabKeyChildScheme} eventKey={tabKeyChildScheme}>{titleChild}</MenuItem>
                  ))
                }
              </NavDropdown>
            );
          }

          return (
            <NavItem key={tabKeyScheme} eventKey={tabKeyScheme}>{title}</NavItem>
          );
        })
      }
    </Nav>
  );
};

export default compose<CarFormBodyHeaderProps, CarFormBodyHeaderOwnProps>(
  withSearch,
)(CarFormBodyHeader);

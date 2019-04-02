import * as React from 'react';
import { Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import carFormTabKey, { mainInfo } from '../formConfig';

type CarFormBodyHeaderOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyHeaderProps = (
  CarFormBodyHeaderOwnProps
  & WithSearchProps
);

const CarFormBodyHeader: React.FC<CarFormBodyHeaderProps> = (props) => {
  const [tabKey, setTabKey] = React.useState(mainInfo.tabKey);
  const {
    params,
  } = props;

  const tabKeyOwn = params.tabKey;

  React.useEffect(
    () => {
      props.setParams({
        tabKey,
      });
    },
    [tabKey],
  );

  React.useEffect(
    () => {
      if (tabKeyOwn !== tabKey) {
        setTabKeyWrap(tabKey);
      }
    },
    [tabKeyOwn],
  );

  const setTabKeyWrap = React.useCallback(
    (tabKeyNew) => {
      setTabKey(tabKeyNew);
    },
    [],
  );

  return (
    <Nav
      bsStyle="tabs"
      activeKey={tabKey}
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

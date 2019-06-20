import * as React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import carFormTabKey from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import { Link } from 'react-router-dom';
import * as queryString from 'query-string';

type CarFormBodyHeaderOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyHeaderProps = (
  CarFormBodyHeaderOwnProps
  & WithSearchProps
);

const CarFormBodyHeader: React.FC<CarFormBodyHeaderProps> = (props) => {
  const carActualSearchStateString = React.useMemo(
    () => {
      return queryString.stringify({
        CarActual_filters: props.searchState.CarActual_filters,
        CarActual_page: props.searchState.CarActual_page,
      });
    },
    [props.searchState.CarActual_filters, props.searchState.CarActual_page],
  );

  const {
    match,
  } = props;

  let urlAsArray = match.path.split('/').map((str) => str === ':car_actual_asuods_id?' ? null :  str);

  const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
  if (emptyIndex > 0) {
    urlAsArray = urlAsArray.slice(0, emptyIndex);
  }

  const pathname = `${urlAsArray.join('/')}/${props.match.params.car_actual_asuods_id}`;

  return (
    <Nav
      bsStyle="tabs"
      id="refs-car-tabs"
    >
      {
        carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
          if ('children' in other) {
            return (
              <NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title}>
                {
                  other.children.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                    <li role="presentation" key={tabKeyChildScheme}>
                      <Link role="menuitem" to={`${pathname}/${tabKeyChildScheme}?${carActualSearchStateString}`}>{titleChild}</Link>
                    </li>
                  ))
                }
              </NavDropdown>
            );
          }

          return (
            <li key={tabKeyScheme} role="presentation">
              <Link role="button" key={tabKeyScheme} to={`${pathname}/${tabKeyScheme}?${carActualSearchStateString}`}>{title}</Link>
            </li>
          );
        })
      }
    </Nav>
  );
};

export default compose<CarFormBodyHeaderProps, CarFormBodyHeaderOwnProps>(
  withSearch,
)(CarFormBodyHeader);

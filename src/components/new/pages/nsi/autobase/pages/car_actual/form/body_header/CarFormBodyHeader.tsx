import * as React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import carFormTabKey from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
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

  return (
    <EtsBootstrap.Nav
      bsStyle="tabs"
      id="refs-car-tabs"
    >
      {
        carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
          if ('children' in other) {
            return (
              <EtsBootstrap.NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title}>
                {
                  other.children.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                    <li role="presentation" key={tabKeyChildScheme}>
                      <Link role="menuitem" to={`/nsi/autobase/car_actual/${props.match.params.car_actual_asuods_id}/${tabKeyChildScheme}?${carActualSearchStateString}`}>{titleChild}</Link>
                    </li>
                  ))
                }
              </EtsBootstrap.NavDropdown>
            );
          }

          return (
            <li key={tabKeyScheme} role="presentation">
              <Link role="button" key={tabKeyScheme} to={`/nsi/autobase/car_actual/${props.match.params.car_actual_asuods_id}/${tabKeyScheme}?${carActualSearchStateString}`}>{title}</Link>
            </li>
          );
        })
      }
    </EtsBootstrap.Nav>
  );
};

export default compose<CarFormBodyHeaderProps, CarFormBodyHeaderOwnProps>(
  withSearch,
)(CarFormBodyHeader);

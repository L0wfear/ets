import * as React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import carFormTabKey from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as queryString from 'query-string';
import {get} from 'lodash';
import { isNullOrUndefined } from 'util';

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
        func_type_id: props.searchState.func_type_id,
        municipal_facility_id: props.searchState.municipal_facility_id,
        route_types: props.searchState.route_types,
        technicalOperationRelationsRegistry_page: props.searchState.technicalOperationRelationsRegistry_page,
        technical_operation_id: props.searchState.technical_operation_id,
      });
    },
    [
      props.searchState.CarActual_filters,
      props.searchState.CarActual_page,
      props.searchState.func_type_id,
      props.searchState.route_types,
      props.searchState.technicalOperationRelationsRegistry_page,
      props.searchState.technical_operation_id,
    ],
  );

  const {
    match,
  } = props;

  let urlAsArray = match.path.split('/').map((str) => str === ':car_actual_asuods_id?' || str === ':technical_operation_relations_type_form?' ? null :  str);

  const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
  if (emptyIndex > 0) {
    urlAsArray = urlAsArray.slice(0, emptyIndex);
  }

  const technical_operation_relations_type_form = get(props, 'match.params.technical_operation_relations_type_form', '');
  const car_actual_asuods_id = get(props, 'match.params.car_actual_asuods_id', '');

  let formTypePath = '';

  if (technical_operation_relations_type_form) {
    formTypePath += `${technical_operation_relations_type_form}/`;
  }
  if (car_actual_asuods_id) {
    formTypePath += car_actual_asuods_id;
  }

  const pathname = `${urlAsArray.join('/')}/${formTypePath}`;
  const activeTabKey = get(props, 'match.params.tabKey', null);

  return (
    <EtsBootstrap.Nav
      bsStyle="tabs"
      id="refs-car-tabs"
      activeKey={activeTabKey}
    >
      {
        carFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
          const isActiveChildren = get(other, 'children', []).find((elem) => elem.tabKey === activeTabKey);
          const isActive = activeTabKey === tabKeyScheme ? true : false;
          if ('children' in other) {
            return (
              <EtsBootstrap.NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title} active={!isNullOrUndefined(isActiveChildren) ? true : false}>
                {
                  other.children.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                    <li role="presentation" key={tabKeyChildScheme}>
                      <Link role="menuitem" to={`${pathname}/${tabKeyChildScheme}?${carActualSearchStateString}`}>{titleChild}</Link>
                    </li>
                  ))
                }
              </EtsBootstrap.NavDropdown>
            );
          }
          return (
            <EtsBootstrap.NavItem key={tabKeyScheme} role="button" active={isActive} href={`#${pathname}/${tabKeyScheme}?${carActualSearchStateString}`}>
              {title}
            </EtsBootstrap.NavItem>
          );
        })
      }
    </EtsBootstrap.Nav>
  );
};

export default compose<CarFormBodyHeaderProps, CarFormBodyHeaderOwnProps>(
  withSearch,
)(CarFormBodyHeader);

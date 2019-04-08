import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Col from 'react-bootstrap/lib/Col';

import * as _ from 'lodash';
import {
  groupBy,
  forOwn,
  sortBy,
  cloneDeep,
} from 'lodash';

import * as queryString from 'query-string';
import * as Raven from 'raven-js';

import {
  EtsPageWrapRoute,
  RouteHeaderContainer,
  SeasonsFilterContainer,
} from 'components/new/pages/routes_list/styled/styled';

import Filter from 'components/ui/table/filter/Filter';
import FilterButton from 'components/ui/table/filter/FilterButton';
import { getTypeRoute, makeRoutesListForRender } from 'components/new/pages/routes_list/utils/utils';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';

import {
  ButtonCreateRoute,
  ButtonUpdateRoute,
  ButtonDeleteRoute,
} from 'components/new/pages/routes_list/buttons/buttons';
import { ExtField } from 'components/ui/new/field/ExtField';

import { getCurrentSeason } from 'utils/dates';
import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { isNull } from 'util';
import {
  routesGetSetRoutes,
  routesLoadRouteById,
  routesRemoveRoute,
} from 'redux-main/reducers/modules/routes/routes/actions';

import RoutesLeftTree from 'components/new/pages/routes_list/RoutesLeftTree';
import { EMPTY_STUCTURE } from 'components/new/pages/routes_list/utils/utils';
import { RoutesTreeColWrap, RouteListContainer } from 'components/new/pages/routes_list/styled/styled';
import { getWarningNotification } from 'utils/notifications';

const SEASONS_OPTIONS = [
  {
    value: 1,
    label: 'Лето',
  },
  {
    value: 2,
    label: 'Зима',
  },
  {
    value: 3,
    label: 'Всесезон',
  },
];

const page = 'route-list';

const makeMainGroupRoute = ([...INPUT_ROUTES]) => {
  const ROUTES: any = groupBy(INPUT_ROUTES, (r) => r.type_name);
  forOwn(ROUTES, (ar1, key1) => {
    ROUTES[key1] = _(ar1)
      .sortBy((r) => r.structure_id)
      .groupBy((r) => r.structure_name || EMPTY_STUCTURE)
      .value();

    Object.entries(ROUTES[key1]).forEach(([key2, arr2]) => {
      ROUTES[key1][key2] = groupBy(arr2, (r: any) => r.front_work_type_name);

      Object.entries(ROUTES[key1][key2]).forEach(([key, arr]) => {
        ROUTES[key1][key2][key] = groupBy(arr, (r: any) => r.technical_operation_name);
      });
    });
  });

  return ROUTES;
};

const filterOptions: any = [
  {
    name: 'technical_operation_id',
    displayName: 'Тех. операция',
    filter: {
      type: 'multiselect',
      byLabel: 'technical_operation_name',
    },
  },
  {
    name: 'type',
    displayName: 'Объект',
    filter: {
      type: 'multiselect',
      byLabel: 'type_name',
    },
  },
  {
    name: 'structure_id',
    displayName: 'Подразделение',
    filter: {
      type: 'multiselect',
      byLabel: 'structure_name',
    },
  },
];

class RoutesList extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);

    // const STRUCTURES = props.structures.map(defaultSelectListMapper);

    this.state = {
      selectedRoute: null,
      selectedRoute_old: null,
      showForm: false,
      filterValues: {},
      filterModalIsOpen: false,
      ROUTES: {},
      routesList: [],
      showId: new Set(),
      season_id: [3, getCurrentSeason(this.props.appConfig.summer_start_date, this.props.appConfig.summer_end_date) === 'winter' ? 2 : 1],
      routesMapNameId: new Map(),
    };
  }

  async componentDidMount() {
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (search && searchObject) {
      const filterValues = {};
      Object.entries(searchObject).forEach(([ key, value ]) => {
        filterValues[key] = {
          type: 'multiselect',
          value: [value],
        };
      });

      this.props.history.replace(this.props.location.pathname, {});
      this.saveFilter(filterValues);
      this.refreshRoutes();
    } else {
      this.refreshRoutes();
    }
  }

  onFormHide = (isSubmited, route) => {
    if (isSubmited === true && route) {
      this.refreshRoutes({ showForm: false })
        .then(() => this.selectRoute(route.id, true));
    } else {
      const { selectedRoute_old } = this.state;

      this.setState({
        selectedRoute: selectedRoute_old,
        showForm: false,
      });
    }
  }

  getRouteById(id) {
    return this.props.routesLoadRouteById(id).then(({ payload: { route_data: route } }) => route);
  }

  handleChangeSeasonId = async (season_id) => {
    this.setState({ season_id });
    await Promise.resolve(true); // рак
    this.saveFilter(this.state.filterValues);
  }

  closeFilter = () => {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  }

  toggleFilter = () => {
    const { filterModalIsOpen } = this.state;
    this.setState({ filterModalIsOpen: !filterModalIsOpen });
  }

  saveFilter = (filterValues) => {
    console.info('SETTING FILTER VALUES', filterValues); // tslint:disable-line

    let ROUTES: any = cloneDeep(this.state.routesList).filter((r) => this.shouldBeRendered(r, filterValues));

    ROUTES = sortBy(ROUTES, (o) => o.name.toLowerCase());
    ROUTES = ROUTES.filter((r) => r.technical_operation_name).sort((a, b) => a.technical_operation_name.toLowerCase().localeCompare(b.technical_operation_name.toLowerCase()));

    ROUTES = Object.entries(groupBy(ROUTES, (r) => r.is_main ? 'main' : 'other')).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});
    this.setState({ filterValues, ROUTES });
  }

  refreshRoutes = async (withState = null) => {
    const {
      payload: {
        data: routesListRaw,
      },
    } = await this.props.routesGetSetRoutes();

    const routesList = makeRoutesListForRender(routesListRaw);

    const routesMapNameId = new Map();

    routesList.forEach(({ id, name }) => routesMapNameId.set(name, id));

    let ROUTES: any = cloneDeep(routesList).filter((r) => this.shouldBeRendered(r, this.state.filterValues));
    ROUTES = sortBy(ROUTES, (o) => o.name.toLowerCase());
    ROUTES = ROUTES.filter((r) => r.technical_operation_name).sort((a, b) => a.technical_operation_name.toLowerCase().localeCompare(b.technical_operation_name.toLowerCase()));

    ROUTES = Object.entries(groupBy(ROUTES, (r) => r.is_main ? 'main' : 'other')).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});

    this.setState({ ...withState, routesList, routesMapNameId, ROUTES });

    return routesList;
  }

  selectRoute = async (routeOrId, force = false) => {
    let routeData = routeOrId;
    const { selectedRoute } = this.state;

    if (selectedRoute && routeOrId === selectedRoute.id && !force) {
      return selectedRoute;
    }

    this.setState({ selectedRoute: null });
    try {
      routeData = await this.getRouteById(routeOrId);
    } catch (e) {
      console.warn(e); // tslint:disable-line
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Не найден маршрут'));

      Raven.captureException(new Error(`Выбор несуществующего маршрута (${routeOrId})`));
      return;
    }
    const { showId: showIdOld } = this.state;
    const showId = cloneDeep(showIdOld);

    const pathToIsMain = routeData.is_main ? 'main' : 'other';
    const pathTo_type = pathToIsMain + getTypeRoute(routeData.type);
    const pathTo_structure_name = pathTo_type + (routeData.structure_name || EMPTY_STUCTURE);
    const pathTo_technical_operation_name_arr = [];
    routeData.work_types.forEach((elem) => {
      const pathToStructureWorkType = `${pathTo_structure_name}${elem.work_type_name}`;

      pathTo_technical_operation_name_arr.push(
        pathToStructureWorkType,
        `${pathToStructureWorkType}${routeData.technical_operation_name}`,
      );
    });

    [pathToIsMain, pathTo_type, pathTo_structure_name, ...pathTo_technical_operation_name_arr].filter((r) => !!r).forEach((r) => showId.has(r) ? '' : showId.add(r));

    this.setState({
      showForm: false,
      selectedRoute: routeData,
      selectedRoute_old: routeData,
      showId,
    });

    return routeData;
  }

  createRoute = () => (
    this.setState({
      showForm: true,
      selectedRoute: {
        is_main: true,
        name: '',
        municipal_facility_id: null,
        municipal_facility_name: '',
        technical_operation_id: null,
        technical_operation_name: '',
        structure_id: null,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    })
  )

  updateRoute = () => (
    this.setState({
      showForm: true,
    })
  )

  copyRoute = () => {
    const copiedRoute = cloneDeep(this.state.selectedRoute);
    delete copiedRoute.name;
    delete copiedRoute.id;
    copiedRoute.copy = true;

    this.setState({
      showForm: true,
      selectedRoute: cloneDeep(copiedRoute),
    });
  }

  deleteRoute = async () => {
    try {
      await global.confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный маршрут?',
      });
    } catch (er) {
      return;
    }

    await this.props.routesRemoveRoute(this.state.selectedRoute.id);
    this.refreshRoutes({ selectedRoute: null });
  }

  handleChange = (selectedRoute) => this.setState({ selectedRoute });

  changeShowId = (showId) => (
    this.setState({ showId })
  )

  shouldBeRendered(obj, filterValues) {
    if (this.state.season_id.some((season_id) => (obj.seasons.some((seasonData) => seasonData.season_id === season_id)))) {
      return Object.entries(filterValues).every(([key, { value }]: any) => {
        if (Array.isArray(obj[key])) {
          return obj[key].some((data) => value.includes(data));
        }
        return value.includes(obj[key]);
      });
    }

    return false;
  }

  render() {
    const {
      ROUTES,
      routesList,
      selectedRoute,
    } = this.state;

    const {
      showForm,
    } = this.state;

    const activeFilter = !!Object.values(this.state.filterValues).length;

    return (
      <EtsPageWrapRoute>
        <RouteListContainer>
          <RoutesTreeColWrap xs={5} md={3}>
            <RoutesLeftTree
              ROUTES={ROUTES}
              showId={this.state.showId}
              changeShowId={this.changeShowId}
              selectRoute={this.selectRoute}
              selectedRoute={this.state.selectedRoute}
            />
          </RoutesTreeColWrap>
          <Col xs={7} md={9}>
            <RouteHeaderContainer className="some-header">
              <div className="waybills-buttons">
                <span>{'Сезон: '}</span>
                <SeasonsFilterContainer>
                  <ExtField
                    id="season_id"
                    type="select"
                    multi
                    label={false}
                    options={SEASONS_OPTIONS}
                    value={this.state.season_id}
                    onChange={this.handleChangeSeasonId}
                  />
                </SeasonsFilterContainer>
                <FilterButton
                  active={activeFilter}
                  onClick={this.toggleFilter}
                />
                <ButtonCreateRoute bsSize="small" onClick={this.createRoute}>
                  <Glyphicon glyph="plus" />
                  {' '}
                  Создать маршрут
                </ButtonCreateRoute>
                <ButtonUpdateRoute bsSize="small" disabled={isNull(selectedRoute)} onClick={this.updateRoute}>
                  <Glyphicon glyph="pencil" />
                  {' '}
                  Изменить маршрут
                </ButtonUpdateRoute>
                <ButtonUpdateRoute bsSize="small" disabled={isNull(selectedRoute)} onClick={this.copyRoute}>
                  <Glyphicon glyph="copy" />
                  {' '}
                  Копировать маршрут
                </ButtonUpdateRoute>
                <ButtonDeleteRoute bsSize="small" disabled={isNull(selectedRoute)} onClick={this.deleteRoute}>
                  <Glyphicon glyph="remove" />
                  {' '}
                  Удалить
                </ButtonDeleteRoute>
              </div>
            </RouteHeaderContainer>
            <Filter
              show={this.state.filterModalIsOpen}
              onSubmit={this.saveFilter}
              onClick={this.toggleFilter}
              onHide={this.closeFilter}
              active={activeFilter}
              values={this.state.filterValues}
              options={filterOptions}
              tableData={routesList}
            />
            <div className="clearfix">
              {
                selectedRoute !== null && selectedRoute.id
                  ? (
                    <RouteInfo
                      route={selectedRoute}
                      mapKey="mapRouteList"
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
              <RouteFormWrap
                page={page}
                showForm={showForm}
                handleHide={this.onFormHide}
                element={selectedRoute}
                routesMapNameId={this.state.routesMapNameId}
              />
            </div>
          </Col>
        </RouteListContainer>
      </EtsPageWrapRoute>
    );
  }
}

export default compose<any, any>(
  connect<any, any, any, ReduxState>(
    (state) => ({
      appConfig: getSessionState(state).appConfig,
      structures: getSessionState(state).userData.structures,
    }),
    (dispatch) => ({
      routesGetSetRoutes: () => (
        dispatch(
          routesGetSetRoutes(
            {},
            { page },
          ),
        )
      ),
      routesLoadRouteById: (id) => (
        dispatch(
          routesLoadRouteById(
            id,
            {
              page,
            },
          ),
        )
      ),
      routesRemoveRoute: (id) => (
        dispatch(
          routesRemoveRoute(
            id,
            { page },
          ),
        )
      ),
    }),
  ),
)(RoutesList);

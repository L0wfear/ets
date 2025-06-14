import * as React from 'react';

import * as _ from 'lodash';
import { groupBy, forOwn, sortBy, cloneDeep } from 'lodash';

import * as queryString from 'query-string';
import * as Raven from 'raven-js';

import {
  EtsPageWrapRoute,
  RouteHeaderContainer,
  SeasonsFilterContainer,
} from 'components/new/pages/routes_list/styled/styled';

import Filter from 'components/old/ui/table/filter/Filter';
import FilterButton from 'components/old/ui/table/filter/FilterButton';
import {
  getTypeRoute,
  makeRoutesListForRender,
} from 'components/new/pages/routes_list/utils/utils';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { isNull } from 'util';
import routesAction from 'redux-main/reducers/modules/routes/actions';

import RoutesLeftTree from 'components/new/pages/routes_list/RoutesLeftTree';
import { EMPTY_STUCTURE } from 'components/new/pages/routes_list/utils/utils';
import {
  RoutesTreeColWrap,
  RouteListContainer,
} from 'components/new/pages/routes_list/styled/styled';
import { getWarningNotification } from 'utils/notifications';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getDefaultRouteElement } from './form/utils';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import routePermissions from 'components/new/pages/routes_list/config-data/permissions';
import { actionSessionUpdateCurrentSeason } from 'redux-main/reducers/modules/session/action_get_config';

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

    Object.entries(ROUTES[key1]).forEach(([key2, arr2]: any) => {
      ROUTES[key1][key2] = groupBy(arr2, (r: any) => r.front_work_type_name);

      Object.entries(ROUTES[key1][key2]).forEach(([key, arr]: any) => {
        ROUTES[key1][key2][key] = groupBy(
          arr,
          (r: any) => r.technical_operation_name,
        );
      });
    });
  });

  return ROUTES;
};

const filterOptions: any = [
  {
    name: 'name',
    displayName: 'Наименование маршрута',
    filter: {
      type: 'multiselect',
    },
  },
  {
    name: 'technical_operation_id',
    displayName: 'Тех. операция',
    filter: {
      type: 'multiselect',
      byLabel: 'technical_operation_name',
    },
  },
  {
    name: 'municipal_facility_id',
    displayName: 'Элемент',
    filter: {
      type: 'multiselect',
      byLabel: 'municipal_facility_name',
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

import { RouteComponentProps } from 'react-router-dom';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type StateProps = {
  appConfig: InitialStateSession['appConfig'];
  structures: InitialStateSession['userData']['structures'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = (
  RouteComponentProps<any>
);
type PropsRoutesList = (
  StateProps
  & DispatchProps
  & OwnProps
);
type StateRoutesList = {
  selectedRoute: Route | null;
  selectedRoute_old: Route | null;
  showForm: boolean;
  filterValues: any;
  filterModalIsOpen: boolean;
  ROUTES: object;
  routesList: Array<Route>;
  showId: Set<any>;
  routesMapNameId: Map<any, any>;
};

class RoutesList extends React.PureComponent<PropsRoutesList, StateRoutesList> {
  constructor(props) {
    super(props);

    // const STRUCTURES = props.structures.map(defaultSelectListMapper);

    this.state = {
      selectedRoute: null,
      selectedRoute_old: null,
      showForm: false,
      filterValues: {
        season_id: {
          type: 'multiselect',
          value: [
            3,
            this.props.appConfig.current_season === 'winter'
              ? 2
              : 1,
          ],
        },
      },
      filterModalIsOpen: false,
      ROUTES: {},
      routesList: [],
      showId: new Set(),
      routesMapNameId: new Map(),
    };
  }

  async componentDidMount() {
    const applyCurrentSeasonFilters = async () => {
      const appConfig = await this.props.dispatch(actionSessionUpdateCurrentSeason({ page }));
      this.handleChangeSeasonId([
        3,
        appConfig.current_season === 'winter'
          ? 2
          : 1
      ]);
    };

    applyCurrentSeasonFilters();

    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);

    if (search && searchObject) {
      const filterValues = {
        ...this.state.filterValues,
      };
      const intValues = ['technical_operation_id'];
      Object.entries(searchObject).forEach(([key, value]) => {
        filterValues[key] = {
          type: 'multiselect',
          value: intValues.includes(key) ? [parseInt(value as string, 10)] : [value],
        };
      });

      this.props.history.replace(this.props.location.pathname, {});
      this.saveFilter(filterValues);
      this.refreshRoutes();
    } else {
      this.refreshRoutes();
    }

    const meta = document.querySelector('meta[property="og:title"]');
    const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
    const new_title = `${etsName} Реестр маршрутов`;

    if (document) {
      document.title = new_title;
    }
    if (meta) {
      meta.setAttribute('content', new_title);
    }
  }

  componentWillUnmount() {
    const meta = document.querySelector('meta[property="og:title"]');
    const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';

    if (document) {
      document.title = etsName;
    }
    if (meta) {
      meta.setAttribute('content', etsName);
    }
  }

  onFormHide = (isSubmitted, route) => {
    if (isSubmitted === true && route) {
      this.refreshRoutes({ showForm: false }).then(() =>
        this.selectRoute(route.id, true),
      );
    } else {
      const { selectedRoute_old } = this.state;

      this.setState({
        selectedRoute: selectedRoute_old,
        showForm: false,
      });
    }
  };

  async getRouteById(id) {
    const route_data = await this.props.dispatch(
      routesAction.actionLoadRouteById(id, { page })
    );
    if (!route_data) {
      throw new Error('Маршрут не найден');
    }
    return route_data;
  }

  handleChangeSeasonId = (value: Array<number>) => {
    const { filterValues } = this.state;

    this.saveFilter({
      ...filterValues,
      season_id: {
        ...filterValues.season_id,
        value,
      },
    });
  };

  closeFilter = () => {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  };

  toggleFilter = () => {
    const { filterModalIsOpen } = this.state;
    this.setState({ filterModalIsOpen: !filterModalIsOpen });
  };

  saveFilter = (filterValues) => {
    console.info('SETTING FILTER VALUES', filterValues); // tslint:disable-line
    if (!filterValues.season_id) {
      filterValues.season_id = this.state.filterValues.season_id;
    }

    let ROUTES: any = cloneDeep(this.state.routesList).filter((r) =>
      this.shouldBeRendered(r, filterValues),
    );

    ROUTES = sortBy(ROUTES, (o) => o.name.toLowerCase());
    ROUTES = ROUTES.filter((r) => r.technical_operation_name).sort((a, b) =>
      a.technical_operation_name
        .toLowerCase()
        .localeCompare(b.technical_operation_name.toLowerCase()),
    );

    ROUTES = Object.entries(
      groupBy(ROUTES, (r) => (r.is_main ? 'main' : 'other')),
    ).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});
    this.setState({ filterValues, ROUTES });
  };

  refreshRoutes = async (withState = null) => {
    const { data: routesListRaw } = await this.props.dispatch(
      routesAction.actionLoadRoutes(
        {},
        { page },
      )
    );

    const routesList = makeRoutesListForRender(routesListRaw);

    const routesMapNameId = new Map();

    routesList.forEach(({ id, name }) => routesMapNameId.set(name, id));

    let ROUTES: any = cloneDeep(routesList).filter((r) =>
      this.shouldBeRendered(r, this.state.filterValues),
    );
    ROUTES = sortBy(ROUTES, (o) => o.name.toLowerCase());
    ROUTES = ROUTES.filter((r) => r.technical_operation_name).sort((a, b) =>
      a.technical_operation_name
        .toLowerCase()
        .localeCompare(b.technical_operation_name.toLowerCase()),
    );

    ROUTES = Object.entries(
      groupBy(ROUTES, (r) => (r.is_main ? 'main' : 'other')),
    ).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});

    this.setState({ ...withState, routesList, routesMapNameId, ROUTES });

    return routesList;
  };

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
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification('Не найден маршрут'),
      );

      Raven.captureException(
        new Error(`Выбор несуществующего маршрута (${routeOrId})`),
      );
      return;
    }
    const { showId: showIdOld } = this.state;
    const showId = cloneDeep(showIdOld);

    const pathToIsMain = routeData.is_main ? 'main' : 'other';
    const pathTo_type = pathToIsMain + getTypeRoute(routeData.type);
    const pathTo_structure_name
      = pathTo_type + (routeData.structure_name || EMPTY_STUCTURE);
    const pathTo_technical_operation_name_arr = [];
    routeData.work_types.forEach((elem) => {
      const pathToStructureWorkType = `${pathTo_structure_name}${
        elem.work_type_name
      }`;

      pathTo_technical_operation_name_arr.push(
        pathToStructureWorkType,
        `${pathToStructureWorkType}${routeData.technical_operation_name}`,
      );
    });

    [
      pathToIsMain,
      pathTo_type,
      pathTo_structure_name,
      ...pathTo_technical_operation_name_arr,
    ]
      .filter((r) => !!r)
      .forEach((r) => (showId.has(r) ? '' : showId.add(r)));

    this.setState({
      showForm: false,
      selectedRoute: routeData,
      selectedRoute_old: routeData,
      showId,
    });

    return routeData;
  };

  createRoute = () =>
    this.setState({
      showForm: true,
      selectedRoute: {
        ...getDefaultRouteElement(),
      },
    });

  updateRoute = () =>
    this.setState({
      showForm: true,
    });

  copyRoute = () => {
    const copiedRoute = cloneDeep(this.state.selectedRoute);
    delete copiedRoute.name;
    delete copiedRoute.id;

    this.setState({
      showForm: true,
      selectedRoute: cloneDeep(copiedRoute),
    });
  };

  deleteRoute = async () => {
    const { selectedRoute } = this.state;
    try {
      await global.confirmDialog({
        title: 'Внимание!',
        body: (
          <>
            <div>
              <span>{'Удаляемый шаблон маршрута: '}</span>
              <span>
                <b>{selectedRoute.name}</b>.
              </span>
            </div>
            <div>
              {
                'Удаление шаблона маршрута возможно только вместе со связанными шаблонами заданий и наряд-заданий. Вы подтверждаете такое удаление?'
              }
            </div>
          </>
        ),
      });
    } catch (er) {
      return;
    }

    await this.props.dispatch(routesAction.actionRemoveRoute(this.state.selectedRoute.id, { page }));
    this.refreshRoutes({ selectedRoute: null });
  };

  handleChange = (selectedRoute) => this.setState({ selectedRoute });

  changeShowId = (showId) => this.setState({ showId });

  shouldBeRendered(obj, filterValues) {
    return Object.entries(filterValues).every(([key, { value }]: any) => {
      if (key === 'season_id') {
        return value.some((season_id) =>
          obj.seasons.some((seasonData) => seasonData.season_id === season_id),
        );
      }
      if (Array.isArray(obj[key])) {
        return obj[key].some((data) => value.includes(data));
      }
      return value.includes(obj[key]);
    });
  }

  render() {
    const { ROUTES, routesList, selectedRoute } = this.state;

    const { showForm } = this.state;

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
          <EtsBootstrap.Col xs={7} md={9}>
            <RouteHeaderContainer className="some-header">
              <div className="waybills-buttons">
                <span>{'Сезон: '}</span>
                <SeasonsFilterContainer>
                  <ExtField
                    id="season_id"
                    type="select"
                    multi
                    label={''}
                    options={SEASONS_OPTIONS}
                    value={this.state.filterValues.season_id.value}
                    onChange={this.handleChangeSeasonId}
                  />
                </SeasonsFilterContainer>
                <FilterButton
                  active={activeFilter}
                  onClick={this.toggleFilter}
                />
                <EtsBootstrap.Button bsSize="small" onClick={this.createRoute} id = "create_route" permissions={routePermissions.create}>
                  <EtsBootstrap.Glyphicon glyph="plus" /> Создать маршрут
                </EtsBootstrap.Button>
                <EtsBootstrap.Button
                  bsSize="small"
                  disabled={isNull(selectedRoute)}
                  onClick={this.updateRoute}
                  permissions={routePermissions.update}
                >
                  <EtsBootstrap.Glyphicon glyph="pencil" /> Изменить маршрут
                </EtsBootstrap.Button>
                <EtsBootstrap.Button
                  bsSize="small"
                  disabled={isNull(selectedRoute)}
                  onClick={this.copyRoute}
                  permissions={routePermissions.create}
                >
                  <EtsBootstrap.Glyphicon glyph="copy" /> Копировать маршрут
                </EtsBootstrap.Button>
                <EtsBootstrap.Button
                  bsSize="small"
                  disabled={isNull(selectedRoute)}
                  onClick={this.deleteRoute}
                  permissions={routePermissions.delete}
                >
                  <EtsBootstrap.Glyphicon glyph="remove" /> Удалить
                </EtsBootstrap.Button>
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
              {selectedRoute !== null && selectedRoute.id ? (
                <RouteInfo route={selectedRoute} mapKey="mapRouteList" />
              ) : (
                <DivNone />
              )}
              <RouteFormWrap
                page={page}
                showForm={showForm}
                handleHide={this.onFormHide}
                element={selectedRoute}
                routesMapNameId={this.state.routesMapNameId}
              />
            </div>
          </EtsBootstrap.Col>
        </RouteListContainer>
      </EtsPageWrapRoute>
    );
  }
}

export default compose<PropsRoutesList, OwnProps>(
  withPreloader({
    page,
    typePreloader: 'mainpage',
  }),
  connect<
    StateProps,
    DispatchProps,
    OwnProps,
    ReduxState
  >(
    (state) => ({
      appConfig: getSessionState(state).appConfig,
      structures: getSessionState(state).userData.structures,
    }),
  ),
)(RoutesList);

import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Col from 'react-bootstrap/lib/Col';

import _, { get } from 'lodash';

import cx from 'classnames';

import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';

import {
  EtsPageWrapRoute,
  RouteHeaderContainer,
  SeasonsFilterContainer,
  SidebarListContainer,
  SpanTitleRouteGroup,
} from 'components/route_new/styled/styled';

import Div from 'components/ui/Div';
import Filter from 'components/ui/table/filter/Filter';
import FilterButton from 'components/ui/table/filter/FilterButton';
import { getTypeRoute, makeRoutesListForRender } from 'components/route_new/utils/utils';
import RouteInfo from 'components/route_new/route-info/RouteInfo';
import RouteFormWrap from 'components/route_new/form/RouteFormWrap';

import {
  ButtonCreateRoute,
  ButtonUpdateRoute,
  ButtonDeleteRoute,
} from 'components/route_new/buttons/buttons';
import { ExtField } from 'components/ui/new/field/ExtField';

import { getCurrentSeason } from 'utils/dates';
import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { loadRouteDataById } from 'redux-main/trash-actions/route/route';

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
  const ROUTES = _.groupBy(INPUT_ROUTES, r => r.type_name);
  _.forOwn(ROUTES, (ar1, key1) => {
    ROUTES[key1] = _(ar1)
      .sortBy(r => r.structure_id)
      .groupBy(r => r.structure_name || 'Без подразделения')
      .value();

    if (Object.keys(ROUTES[key1]).length === 1 && Object.keys(ROUTES[key1])[0] === 'Без подразделения') {
      ROUTES[key1] = _.groupBy(ar1, r => r.front_work_type_name);

      Object.entries(ROUTES[key1]).forEach(([key, arr]) => {
        ROUTES[key1][key] = _.groupBy(arr, r => r.technical_operation_name);
      });
    } else {
      Object.entries(ROUTES[key1]).forEach(([key2, arr2]) => {
        ROUTES[key1][key2] = _.groupBy(arr2, r => r.front_work_type_name);

        Object.entries(ROUTES[key1][key2]).forEach(([key, arr]) => {
          ROUTES[key1][key2][key] = _.groupBy(arr, r => r.technical_operation_name);
        });
      });
    }
  });

  return ROUTES;
};

class RoutesList extends React.Component {
  static get propTypes() {
    return {
      appConfig: PropTypes.object.isRequired,
      technicalOperationsList: PropTypes.array.isRequired,
      technicalOperationsObjectsList: PropTypes.array.isRequired,
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      loadRouteDataById: PropTypes.func.isRequired,
    };
  }

  static contextTypes = {
    flux: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const season = getCurrentSeason(this.props.appConfig.summer_start, this.props.appConfig.summer_end);

    this.state = {
      selectedRoute: null,
      selectedRoute_old: null,
      showForm: false,
      filterValues: {},
      filterModalIsOpen: false,
      showId: [-1],
      season_id: [3, season === 'winter' ? 2 : 1],
      routesMapNameId: new Map(),
    };
  }

  async componentDidMount() {
    const { flux } = this.context;

    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('geoObjects').getGeozones();

    await flux.getActions('technicalOperation').getTechnicalOperations();

    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (search && searchObject) {
      const filterValues = {};
      _.mapKeys(searchObject, (v, k) => {
        filterValues[k] = {
          type: 'multiselect',
          value: [v],
        };
      });

      this.props.history.replace(this.props.location.pathname, {});
      this.refreshRoutes({ filterValues });
    } else {
      this.refreshRoutes();
    }
  }

  onFormHide = (isSubmited, payloadData) => {
    const route = get(payloadData, ['payload', 'route'], null);

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

  getStructures() {
    return this.context.flux.getStore('session').getCurrentUser().structures.map(({ name }) => ({ value: name, label: name }));
  }

  getRouteById(id) {
    return this.props.loadRouteDataById(id).then(({ payload: { route_data: route } }) => route);
  }

  handleChangeSeasonId = (season_id) => {
    this.setState({ season_id });
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
    console.info('SETTING FILTER VALUES', filterValues); // eslint-disable-line
    this.setState({ filterValues });
  }

  refreshRoutes = (withState = null) => (
    Promise.all([
      this.context.flux.getActions('routes').getRoutes().then(({ result }) => result),
      Promise.resolve(this.getStructures()),
    ])
      .then(([routesListFromStore]) => {
        const routesList = makeRoutesListForRender(routesListFromStore);

        const routesMapNameId = new Map();

        routesList.forEach(({ id, name }) => routesMapNameId.set(name, id));

        this.setState({ ...withState, routesList, routesMapNameId });

        return routesList;
      })
  );

  selectRoute = async (routeOrId, force = false) => {
    let routeData = routeOrId;
    const { selectedRoute } = this.state;

    if (selectedRoute && routeOrId === selectedRoute.id && !force) {
      return selectedRoute;
    }

    this.setState({ selectedRoute: null });
    routeData = await this.getRouteById(routeOrId);
    const { showId } = this.state;

    const pathToIsMain = routeData.is_main ? 'main' : 'other';
    const pathTo_type = pathToIsMain + getTypeRoute(routeData.type);
    const pathTo_structure_name = pathTo_type + routeData.structure_name || 'Без подразделения';

    const pathTo_technical_operation_name_arr = [];
    routeData.work_types.forEach((elem) => {
      const pathToStructureWorkType = `${pathTo_structure_name}${elem.work_type_name}`;

      pathTo_technical_operation_name_arr.push(
        pathToStructureWorkType,
        `${pathToStructureWorkType}${routeData.technical_operation_name}`,
      );
    });

    [pathToIsMain, pathTo_type, pathTo_structure_name, ...pathTo_technical_operation_name_arr].filter(r => !!r).forEach(r => showId.includes(r) ? '' : showId.push(r));
    this.setState({
      showForm: false,
      selectedRoute: routeData,
      selectedRoute_old: routeData,
      showId,
    });

    return routeData;
  }

  createRoute = () => this.setState({
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
  });

  copyRoute = () => {
    const copiedRoute = _.cloneDeep(this.state.selectedRoute);
    delete copiedRoute.name;
    delete copiedRoute.id;
    copiedRoute.copy = true;

    this.setState({
      showForm: true,
      selectedRoute: _.cloneDeep(copiedRoute),
    });
  }

  deleteRoute = async () => {
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный маршрут?',
      });
    } catch (er) {
      return;
    }

    await this.context.flux.getActions('routes').removeRoute(this.state.selectedRoute);
    this.refreshRoutes({ selectedRoute: null });
  }

  handleChange = selectedRoute => this.setState({ selectedRoute });

  handleDropdown = (name) => {
    const { showId } = this.state;
    const i = this.state.showId.indexOf(name);
    if (i < 0) {
      showId.push(name);
    } else {
      showId.splice(i, 1);
    }
    this.setState({ showId });
  }

  shouldBeRendered(obj) {
    if (this.state.season_id.some(season_id => (obj.seasons.some(seasonData => seasonData.season_id === season_id)))) {
      return Object.entries(this.state.filterValues).every(([key, { value }]) => {
        if (Array.isArray(obj[key])) {
          return obj[key].some(data => value.includes(data));
        }
        return value.includes(obj[key]);
      });
    }

    return false;
  }

  renderItem = (collection, parentName = '') => {
    if (Array.isArray(collection)) {
      return collection.map((r, i) => {
        const cn = cx('sidebar__list-item', { 'active': this.state.selectedRoute && r.id === this.state.selectedRoute.id });
        return <li className={cn} onClick={() => this.selectRoute(r.id)} key={i}>{r.name}</li>;
      });
    }
    return _.map(collection, (childrenCollection, name) => {
      const hidden = !(this.state.showId.indexOf(parentName + name) + 1);
      return (
        <div key={name}>
          <h5>
            <span style={{ cursor: 'pointer' }} onClick={() => this.handleDropdown(parentName + name)}>
              {name}
              <span
                style={{
                  fontSize: 9,
                  position: 'relative',
                  top: -1,
                }}
              >
                {!hidden ? ' \u25BC' : ' \u25BA'}
              </span>
            </span>
          </h5>
          <Div hidden={hidden} style={{ paddingLeft: 10 }}>
            {this.renderItem(childrenCollection, parentName + name)}
          </Div>
        </div>
      );
    });
  }

  render() {
    const { routesList = [] } = this.state;
    const { technicalOperationsList = [], technicalOperationsObjectsList = [] } = this.props;
    const route = this.state.selectedRoute;

    const TECH_OPERATIONS = _.uniqBy(
      technicalOperationsList.map(({ name }) => ({ value: name, label: name })),
      'value',
    );
    const OBJECTS = technicalOperationsObjectsList.map(({ type, full_name }) => ({ value: type, label: full_name }));
    const STRUCTURES = this.getStructures();

    let ROUTES = _.cloneDeep(routesList).filter(r => this.shouldBeRendered(r));
    ROUTES = _.sortBy(ROUTES, o => o.name.toLowerCase());
    ROUTES = ROUTES.filter(r => r.technical_operation_name).sort((a, b) => a.technical_operation_name.toLowerCase().localeCompare(b.technical_operation_name.toLowerCase()));

    ROUTES = Object.entries(_.groupBy(ROUTES, r => r.is_main ? 'main' : 'other')).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});

    let filterOptions = [
      {
        name: 'name',
        displayName: 'Наименование маршрута',
        filter: {
          type: 'multiselect',
          options: routesList.map(({ name }) => ({ value: name, label: name })),
        },
      },
      {
        name: 'technical_operation_name',
        displayName: 'Тех. операция',
        filter: {
          type: 'multiselect',
          options: TECH_OPERATIONS,
        },
      },
      {
        name: 'municipal_facility_id',
        displayName: 'Элемент',
        filter: {
          type: 'multiselect',
          options: _.uniqBy(
            routesList.map(({ municipal_facility_id, municipal_facility_name }) => ({
              value: municipal_facility_id,
              label: municipal_facility_name,
            })),
            'value',
          ),
        },
      },
      {
        name: 'type',
        displayName: 'Объект',
        filter: {
          type: 'multiselect',
          options: OBJECTS,
        },
      },
    ];

    if (STRUCTURES.length) {
      filterOptions = filterOptions.concat({
        name: 'structure_name',
        displayName: 'Подразделение',
        filter: {
          type: 'multiselect',
          options: STRUCTURES,
        },
      });
    }

    const {
      showForm,
    } = this.state;

    return (
      <EtsPageWrapRoute inheritDisplay>
        <Col xs={5} md={3} className="sidebar">
          <header className="sidebar__header clearfix">
            <div className="sidebar__header-title col-xs-12">
              Список маршрутов
            </div>
          </header>
          <SidebarListContainer>
            <div>
              <SpanTitleRouteGroup>Основные:</SpanTitleRouteGroup>
              {this.renderItem(ROUTES.main, 'main')}
            </div>
            <div>
              <SpanTitleRouteGroup className="second">Дополнительные:</SpanTitleRouteGroup>
              {this.renderItem(ROUTES.other, 'other')}
            </div>
          </SidebarListContainer>
        </Col>
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
                show={this.state.filterModalIsOpen}
                active={!!_.keys(this.state.filterValues).length}
                onClick={this.toggleFilter}
              />
              <ButtonCreateRoute bsSize="small" onClick={this.createRoute}>
                <Glyphicon glyph="plus" />
                {' '}
                Создать маршрут
              </ButtonCreateRoute>
              <ButtonUpdateRoute bsSize="small" disabled={route === null} onClick={() => this.setState({ showForm: true })}>
                <Glyphicon glyph="pencil" />
                {' '}
                Изменить маршрут
              </ButtonUpdateRoute>
              <ButtonUpdateRoute bsSize="small" disabled={route === null} onClick={this.copyRoute}>
                <Glyphicon glyph="copy" />
                {' '}
                Копировать маршрут
              </ButtonUpdateRoute>
              <ButtonDeleteRoute bsSize="small" disabled={route === null} onClick={this.deleteRoute}>
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
            active={_.keys(this.state.filterValues).length}
            values={this.state.filterValues}
            options={filterOptions}
          />
          <div className="clearfix">
            {
              route !== null && route.id
                ? (
                  <RouteInfo
                    route={route}
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
              element={route}
              routesMapNameId={this.state.routesMapNameId}
            />
          </div>
        </Col>

      </EtsPageWrapRoute>
    );
  }
}

export default connectToStores(
  connect(
    null,
    dispatch => ({
      loadRouteDataById: id => (
        dispatch(
          loadRouteDataById(
            'none',
            id,
            {
              promise: true,
            },
          ),
        )
      ),
    }),
  )(RoutesList), ['routes', 'objects', 'geoObjects']);

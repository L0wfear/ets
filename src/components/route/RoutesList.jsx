import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Glyphicon, Col } from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';

import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';

import {
  EtsPageWrapRoute,
  RouteHeaderContainer,
  SeasonsFilterContainer,
  SidebarListContainer,
  SpanTitleRouteGroup,
} from 'components/route/styled/styled';

import Div from 'components/ui/Div';
import Filter from 'components/ui/table/filter/Filter';
import FilterButton from 'components/ui/table/filter/FilterButton';
import { getTypeRoute, makeRoutesListForRender } from 'components/route/utils/utils.js';
import RouteInfo from 'components/route/RouteInfo';
import RouteFormWrap from 'components/route/RouteFormWrap';

import {
  ButtonCreateRoute,
  ButtonUpdateRoute,
  ButtonDeleteRoute,
} from 'components/route/buttons/buttons';
import { ExtField } from 'components/ui/Field';

import { getCurrentSeason } from 'utils/dates';

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

  console.log(ROUTES)
  return ROUTES;
};

class RoutesList extends React.Component {

  static get propTypes() {
    return {
      appConfig: PropTypes.object,
      technicalOperationsList: PropTypes.array,
      technicalOperationsObjectsList: PropTypes.array,
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
    };
  }

  async componentDidMount() {
    const { flux } = this.context;

    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('geoObjects').getGeozones();

    await flux.getActions('technicalOperation').getTechnicalOperations();

    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (searchObject) {
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

  onFormHide = (isSubmited, result) => {
    if (isSubmited === true) {
      this.refreshRoutes({ showForm: false })
        .then(() => this.selectRoute(result.createdRoute.result[0].id));
    } else {
      this.setState({
        selectedRoute: this.state.selectedRoute_old,
        showForm: false,
      });
    }
  }

  getStructures() {
    return this.context.flux.getStore('session').getCurrentUser().structures.map(({ name }) => ({ value: name, label: name }));
  }

  refreshRoutes = (withState = null) => (
    Promise.all([
      this.context.flux.getActions('routes').getRoutes().then(({ result }) => result),
      Promise.resolve(this.getStructures()),
    ])
    .then(([routesListFromStore]) => {
      const routesList = makeRoutesListForRender(routesListFromStore);

      this.setState({ ...withState, routesList });

      return routesList;
    })
  )

  handleChangeSeasonId = (season_id) => {
    this.setState({ season_id });
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

  closeFilter = () => {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  }

  toggleFilter = () => this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });

  saveFilter = (filterValues) => {
    console.info('SETTING FILTER VALUES', filterValues); // eslint-disable-line
    this.setState({ filterValues });
  }

  selectRoute = (id) => {
    this.setState({ selectedRoute: null });

    return this.context.flux.getActions('routes').getRouteById(id).then((route) => {
      const { showId } = this.state;

      const pathToIsMain = route.is_main ? 'main' : 'other';
      const pathTo_type = pathToIsMain + getTypeRoute(route.type);
      const pathTo_structure_name = pathTo_type + route.structure_name || 'Без подразделения';

      let pathTo_technical_operation_name_arr = [];
      route.work_types.forEach((elem) => pathTo_technical_operation_name_arr.push(pathTo_structure_name + elem.work_type_name, pathTo_structure_name + elem.work_type_name + route.technical_operation_name));

      [pathToIsMain, pathTo_type, pathTo_structure_name, ...pathTo_technical_operation_name_arr].filter(r => !!r).forEach(r => showId.includes(r) ? '' : showId.push(r));
      this.setState({
        showForm: false,
        selectedRoute: route,
        selectedRoute_old: route,
        showId,
      });

      return route;
    });
  }

  createRoute = () =>
    this.setState({
      showForm: true,
      selectedRoute: {
        name: '',
        polys: {},
        object_list: [],
        draw_object_list: [],
        input_lines: [],
        type: '',
        is_main: true,
      },
    });

  copyRoute = () => {
    const copiedRoute = _.cloneDeep(this.state.selectedRoute);
    delete copiedRoute.name;
    delete copiedRoute.id;
    delete copiedRoute.comment;
    delete copiedRoute.number;
    copiedRoute.copy = true;

    this.setState({
      showForm: true,
      selectedRoute: _.cloneDeep(copiedRoute),
    });
  }

  deleteRoute = async() => {
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

  editRoute = route => this.setState({ selectedRoute: route });
  handleChange = selectedRoute => this.setState({ selectedRoute });

  handleDropdown = (name) => {
    console.log('handleDropdown name ===', name);
    console.log('this.state.showId === ', this.state.showId);
    const { showId } = this.state;
    const i = this.state.showId.indexOf(name);
    if (i < 0) {
      showId.push(name);
    } else {
      showId.splice(i, 1);
    }
    this.setState({ showId });
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
      return (<div key={name}>
        <h5>
          <span style={{ cursor: 'pointer' }} onClick={() => this.handleDropdown(parentName + name)}>
            {name}
            <span
              style={{
                fontSize: 9,
                position: 'relative',
                top: -1,
              }}
            >{!hidden ? ' \u25BC' : ' \u25BA'}</span>
          </span>
        </h5>
        <Div hidden={hidden} style={{ paddingLeft: 10 }}>
          {this.renderItem(childrenCollection, parentName + name)}
        </Div>
      </div>);
    });
  }

  render() {
    const { routesList = [] } = this.state;
    const { technicalOperationsList = [], technicalOperationsObjectsList = [] } = this.props;
    const route = this.state.selectedRoute;

    const TECH_OPERATIONS = _.uniqBy(
      technicalOperationsList.map(({ name }) => ({ value: name, label: name })),
      'value'
    );
    const OBJECTS = technicalOperationsObjectsList.map(({ type, full_name }) => ({ value: type, label: full_name }));
    const STRUCTURES = this.getStructures();

    let filterOptions = [
      {
        name: 'technical_operation_name',
        displayName: 'Тех. операция',
        filter: {
          type: 'multiselect',
          options: TECH_OPERATIONS,
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

    let ROUTES = _.cloneDeep(routesList).filter(r => this.shouldBeRendered(r));
    ROUTES = _.sortBy(ROUTES, o => o.name.toLowerCase());
    ROUTES = ROUTES.filter(r => r.technical_operation_name).sort((a, b) => a.technical_operation_name.toLowerCase().localeCompare(b.technical_operation_name.toLowerCase()));

    ROUTES = Object.entries(_.groupBy(ROUTES, r => r.is_main ? 'main' : 'other')).reduce((newObj, [key, arr]) => {
      newObj[key] = makeMainGroupRoute(arr);

      return newObj;
    }, {});
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
        <Col xs={7} md={9} >
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
              <ButtonCreateRoute bsSize="small" onClick={this.createRoute}><Glyphicon glyph="plus" /> Создать маршрут</ButtonCreateRoute>
              <ButtonUpdateRoute bsSize="small" disabled={route === null} onClick={() => this.setState({ showForm: true })}><Glyphicon glyph="pencil" /> Изменить маршрут</ButtonUpdateRoute>
              <ButtonUpdateRoute bsSize="small" disabled={route === null} onClick={this.copyRoute}><Glyphicon glyph="copy" /> Копировать маршрут</ButtonUpdateRoute>
              <ButtonDeleteRoute bsSize="small" disabled={route === null} onClick={this.deleteRoute}><Glyphicon glyph="remove" /> Удалить</ButtonDeleteRoute>
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
            <Div hidden={this.state.showForm || route === null}>
              <RouteInfo route={route} />
            </Div>
            <RouteFormWrap
              element={route}
              onFormHide={this.onFormHide}
              showForm={this.state.showForm}
              routesList={routesList}
            />
          </div>
        </Col>

      </EtsPageWrapRoute>
    );
  }
}

export default connectToStores(RoutesList, ['routes', 'objects', 'geoObjects']);

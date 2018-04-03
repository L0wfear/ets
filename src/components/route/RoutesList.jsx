import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';

import Div from 'components/ui/Div.jsx';
import Filter from 'components/ui/table/filter/Filter.jsx';
import FilterButton from 'components/ui/table/filter/FilterButton.jsx';
import RouteInfo from './RouteInfo.jsx';
import RouteFormWrap from './RouteFormWrap.jsx';

const getTypeRoute = (type) => {
  switch (type) {
    case 'mixed':
    case 'simple':
    case 'vector':
      return 'Маршруты по ОДХ';
    case 'simple_dt':
      return 'Маршруты по ДТ';
    case 'points':
      return 'Маршруты по пунктам назначения';
    default:
      return 'error';
  }
};

const makeRoutesListForRender = (routesListFromStore, technicalOperationsList, STRUCTURES) => {
  routesListFromStore.forEach((r) => {
    r.technical_operation_name = _.get(technicalOperationsList.find(t => t.id === r.technical_operation_id), 'name');
    r.structure_name = _.get(STRUCTURES.find(t => t.value === r.structure_id), 'label');
    r.type_name = getTypeRoute(r.type);
  });
  return routesListFromStore;
};

class RoutesList extends Component {

  static get propTypes() {
    return {
      location: PropTypes.object,
      routesList: PropTypes.array,
      technicalOperationsList: PropTypes.array,
      technicalOperationsObjectsList: PropTypes.array,
    };
  }

  static contextTypes = {
    flux: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedRoute: null,
      showForm: false,
      filterValues: {},
      filterModalIsOpen: false,
      showId: [-1],
    };
  }

  async componentDidMount() {
    const { flux } = this.context;
    const STRUCTURES = this.getStructures();

    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('geoObjects').getGeozones();

    await flux.getActions('technicalOperation').getTechnicalOperations();
    const { technicalOperationsList = [] } = this.props;

    const routesListFromStore = await flux.getActions('routes').getRoutes().then(({ result }) => result);
    const routesList = makeRoutesListForRender(routesListFromStore, technicalOperationsList, STRUCTURES);

    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (searchObject) {
      const filterValues = {};
      _.mapKeys(searchObject, (v, k) => {
        filterValues[k] = [v];
      });
      this.setState({ filterValues, routesList });
    } else {
      this.setState({ routesList });
    }
  }

  onFormHide = () => {
    this.setState({
      showForm: false,
      selectedRoute: null,
    });
  }

  getStructures() {
    return this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));
  }

  selectedRoute = (selectedRouter) => {
    const { showId } = this.state;

    const STRUCTURES = this.getStructures();
    const { technicalOperationsList = [] } = this.props;

    const type = getTypeRoute(selectedRouter.type);
    const structure_name = type + _.get(STRUCTURES.find(t => t.value === selectedRouter.structure_id), 'label') || 'Без подразделения';
    const technical_operation_name = structure_name + _.get(technicalOperationsList.find(t => t.id === selectedRouter.technical_operation_id), 'name');

    [type, structure_name, technical_operation_name].forEach(r => showId.includes(r) ? '' : showId.push(r));

    this.setState({
      showForm: false,
      selectedRouter,
      showId,
    });
  }

  shouldBeRendered(obj) {
    let isValid = true;
    _.mapKeys(this.state.filterValues, (value, key) => {
      if (_.isArray(value)) {
        if (!obj[key]) {
          isValid = false;
        } else if (value.indexOf(obj[key].toString()) === -1) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  closeFilter = () => {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  }

  toggleFilter = () => {
    this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });
  }

  saveFilter = (filterValues) => {
    console.info('SETTING FILTER VALUES', filterValues);
    this.setState({ filterValues });
  }

  selectRoute = (id) => {
    const { flux } = this.context;
    this.setState({ selectedRoute: null });
    flux.getActions('routes').getRouteById(id).then((route) => {
      this.setState({ selectedRoute: route });
    });
  }

  createRoute = () => {
    const newR = {
      name: '',
      polys: {},
      object_list: [],
      draw_object_list: [],
      type: '',
    };

    this.setState({
      showForm: true,
      selectedRoute: _.cloneDeep(newR),
    });
  }

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

  deleteRoute = async() => {
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный маршрут?',
      });
    } catch (er) {
      return;
    }
    const { flux } = this.context;
    const routesListFromStore = await flux.getActions('routes').removeRoute(this.state.selectedRoute).then(({ result }) => result);
    const routesListAfterDeleteRoute = makeRoutesListForRender(routesListFromStore, this.props.technicalOperationsList, this.getStructures());

    this.setState({ selectedRoute: null, routesList: routesListAfterDeleteRoute });
  }

  editRoute = (route) => {
    this.setState({
      selectedRoute: route,
    });
  }

  handleChange = (selectedRoute) => {
    this.setState({ selectedRoute });
  }

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
        name: 'structure_id',
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

    ROUTES = _.groupBy(ROUTES, r => r.type_name);
    _.forOwn(ROUTES, (ar1, key1) => {
      ROUTES[key1] = _(ar1)
        .sortBy(r => r.structure_id)
        .groupBy(r => r.structure_name || 'Без подразделения')
        .value();
      if (Object.keys(ROUTES[key1]).length === 1 && Object.keys(ROUTES[key1])[0] === 'Без подразделения') {
        ROUTES[key1] = _.groupBy(ar1, r => r.technical_operation_name);
      } else {
        _.forOwn(ROUTES[key1], (ar2, key2) => {
          ROUTES[key1][key2] = _.groupBy(ar2, r => r.technical_operation_name);
        });
      }
    });

    return (
      <div className="ets-page-wrap routes-list">
        <Row>
          <Col xs={5} md={3} className="sidebar">
            <header className="sidebar__header clearfix">
              <div className="sidebar__header-title col-xs-12">
                Список маршрутов
              </div>
            </header>
            <div className="sidebar__list-container" style={{ marginBottom: '30px !important', marginLeft: 20, top: '70px' }}>
              {this.renderItem(ROUTES)}
            </div>
          </Col>
          <Col xs={7} md={9} className="col-xs-offset-5 col-md-offset-3">
            <div className="some-header clearfix">
              <div className="waybills-buttons">
                <FilterButton
                  show={this.state.filterModalIsOpen}
                  active={!!_.keys(this.state.filterValues).length}
                  onClick={this.toggleFilter}
                />
                <Button bsSize="small" onClick={this.createRoute}><Glyphicon glyph="plus" /> Создать маршрут</Button>
                <Button bsSize="small" disabled={route === null} onClick={() => this.setState({ showForm: true })}><Glyphicon glyph="pencil" /> Изменить маршрут</Button>
                <Button bsSize="small" disabled={route === null} onClick={this.copyRoute}><Glyphicon glyph="copy" /> Копировать маршрут</Button>
                <Button bsSize="small" disabled={route === null} onClick={this.deleteRoute}><Glyphicon glyph="remove" /> Удалить</Button>
              </div>
            </div>
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
                selectedRoute={this.selectedRoute}
                showForm={this.state.showForm}
                routesList={routesList}
              />
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}

export default connectToStores(RoutesList, ['routes', 'objects', 'geoObjects']);

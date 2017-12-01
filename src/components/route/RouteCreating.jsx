import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import { Row, Col, FormControl, Button, Glyphicon } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import MapWrap from 'components/ui/input/map/MapWrap.tsx';

import { polyState } from 'constants/polygons.js';
import CheckList from './CheckList.jsx';

@autobind
class RouteCreating extends Component {

  static get propTypes() {
    return {
      route: PropTypes.object,
      onChange: PropTypes.func,
      geozonePolys: PropTypes.object,
      manual: PropTypes.bool,
      odhPolys: PropTypes.object,
      dtPolys: PropTypes.object,
      formErrors: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props);

    const sessionStore = context.flux.getStore('session');

    this.state = {
      routeName: '',
      zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
      center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
    };
  }

  async componentDidMount() {
    const { flux } = this.context;
    const shwoBridge = flux.getStore('session').getPermission(['bridges.list']);

    if (shwoBridge) {
      await flux.getActions('geoObjects').getGeozoneByTypeWithGeometry('bridges', 'GormostService', {});
      flux.getActions('geoObjects').setSelectedPolysType('bridges');

      const bridgesPolys = flux.getStore('geoObjects').getSelectedPolys();

      this.setState({ bridgesPolys });
    }
  }

  onGeozoneSelectChange(type, v) {
    let { object_list = [] } = this.props.route;
    const { polys = {} } = this.props.route;
    const { geozonePolys = {} } = this.props;
    const odhs = (v || '').split(',');

    if (odhs.length > object_list.length) {
      const object_id = _.last(odhs);
      object_list.push({ object_id: parseInt(object_id, 10), type, name: geozonePolys[object_id].name, state: polyState.ENABLED });
      polys[object_id].state = polyState.ENABLED;
    } else {
      object_list = object_list.filter((o) => {
        const index = odhs.indexOf(o.object_id.toString());
        if (index === -1) {
          polys[o.object_id].state = polyState.SELECTABLE;
        }
        return index > -1;
      });
    }
    this.props.onChange('polys', polys);
    this.props.onChange('object_list', object_list);
  }

  onObjectNameChange(i, v) {
    const { object_list = [] } = this.props.route;
    object_list[i].name = v.target.value;
    this.props.onChange('object_list', object_list);
  }

  setODH(id, name, state) {
    const { object_list = [] } = this.props.route;
    const objectIndex = object_list.findIndex(d => d.object_id === +id);
    const type = this.props.route.type === 'simple_dt' ? 'dt' : 'odh';

    if (state === polyState.SELECTABLE) {
      object_list.splice(objectIndex, 1);
    } else if (objectIndex > -1) {
      object_list[objectIndex] = { object_id: parseInt(id, 10), type, name, state };
    } else {
      object_list.push({ object_id: parseInt(id, 10), type, name, state });
    }

    this.props.onChange('object_list', object_list);
  }

  checkRoute() {
    const { flux } = this.context;
    if (!this.props.route.draw_object_list.length) {
      this.props.onChange('draw_odh_list', []);
      return;
    }
    flux.getActions('routes').validateRoute(this.props.route).then((r) => {
      const result = r.result;

      const draw_odh_list = result.odh_validate_result.filter(res => res.status !== 'fail').map(o => ({
        name: o.odh_name,
        object_id: o.odh_id,
        state: 2,
        type: 'odh',
      }));
      this.props.onChange('draw_odh_list', draw_odh_list);
    });
  }

  handleCheckbox(type, v, e) {
    let { object_list = [] } = this.props.route;
    const { polys = {} } = this.props.route;
    const { geozonePolys = {} } = this.props;
    const odhs = v.split(',').map(e => parseInt(e, 10));
    object_list.forEach((obj) => {
      const i = odhs.indexOf(obj.object_id);
      if (i + 1) odhs.splice(i, 1);
    });
    if (e.target.checked) {
      odhs.forEach((e) => {
        object_list.push({ object_id: e, type, name: geozonePolys[e].name, state: polyState.ENABLED });
        polys[e].state = polyState.ENABLED;
      });
    } else {
      object_list = [];
      _.forEach(polys, e => (e.state = polyState.SELECTABLE));
    }

    this.props.onChange('polys', polys);
    this.props.onChange('object_list', object_list);
  }

  removeObject(i) {
    const { object_list = [] } = this.props.route;
    object_list.splice(i, 1);
    this.props.onChange('object_list', object_list);
  }

  handleFeatureClick = ({ id, name, nextState }) => {
    const {
      route: {
        polys: polysOld,
      },
    } = this.props;

    const polys = _.cloneDeep(polysOld);

    polys[id].state = nextState;

    this.props.onChange('polys', polys);
    this.setODH(id, name, nextState);
  }
  handlePointAdd = ({ newPointObject }) => {
    const {
      route: {
        object_list: object_list_old = [],
      } = {},
    } = this.props;
    const object_list = _.cloneDeep(object_list_old);

    object_list.push(newPointObject);

    this.props.onChange('object_list', object_list);
  }
  handleDrawFeatureAdd = ({ drawObjectNew }) => {
    const { draw_object_list = [] } = this.props.route;

    draw_object_list.push(drawObjectNew);

    this.props.onChange('draw_object_list', draw_object_list);
  }
  handleDrawFeatureClick = ({ index, nextState }) => {
    const {
      route: {
        draw_object_list: draw_object_list_old,
      },
    } = this.props;
    const draw_object_list = _.cloneDeep(draw_object_list_old);

    draw_object_list[index].state = nextState;

    this.props.onChange('draw_object_list', draw_object_list);
  }
  handleRemoveLastDrawFeature = () => {
    const {
      route: {
        draw_object_list: draw_object_list_old,
      },
    } = this.props;
    const draw_object_list = _.cloneDeep(draw_object_list_old);
    draw_object_list.pop();

    this.props.onChange('draw_object_list', draw_object_list);
  }

  render() {
    const [errors = []] = [this.props.formErrors];

    const { route = {} } = this.props;
    const { bridgesPolys = {} } = this.state;
    const {
      object_list = [],
      draw_object_list = [],
      polys = {},
    } = route;
    const [draw_list = []] = [route.draw_odh_list];

    const MapPolys = Object.assign({}, bridgesPolys, polys);
    const list = object_list.filter(o => o.type) || [];
    const polysRT = route.type === 'simple_dt' ? this.props.dtPolys : this.props.odhPolys;
    const fail_list = _.map(polysRT, (v, k) => ({ name: v.name, object_id: parseInt(k, 10), type: 'odh', state: v.state })).filter(o => !list.concat(draw_list).find(e => e.object_id === o.object_id));
    const ODHS = _.map(this.props.odhPolys, (v, k) => ({ label: v.name, value: k }));
    const DTS = _.map(this.props.dtPolys, (v, k) => ({ label: v.name, value: k }));

    return (
      <div>
        <Row>
          <Col md={9}>
            <Div className="route-creating">
              <MapWrap
                objectsType={route.type}
                manual={this.props.manual}
                polys={MapPolys}
                objectList={object_list}
                drawObjectList={draw_object_list}
                handleFeatureClick={this.handleFeatureClick}
                handlePointAdd={this.handlePointAdd}
                handleDrawFeatureAdd={this.handleDrawFeatureAdd}
                handleDrawFeatureClick={this.handleDrawFeatureClick}
                handleRemoveLastDrawFeature={this.handleRemoveLastDrawFeature}
              />
            </Div>
          </Col>
          <Col md={3}>
            <div style={{ overflowY: 'auto', height: 510 }}>
              <Div hidden={route.type !== 'mixed'} className="odh-container">
                <div className="form-group">
                  <div className="checkbox">
                    <label className="">
                      <input type="checkbox" label="Выбрать все" disabled={!ODHS.length} checked={!fail_list.length} onChange={this.handleCheckbox.bind(this, 'odh', ODHS.map(o => o.value).join(','))} />
                      <span>Выбрать все</span>
                    </label>
                  </div>
                </div>
                <Field
                  type="select"
                  label="Список выбранных ОДХ"
                  multi
                  options={ODHS}
                  value={object_list.map(o => o.object_id).join(',')}
                  onChange={this.onGeozoneSelectChange.bind(this, 'odh')}
                  error={errors.object_list}
                />
              </Div>
              <Div hidden={route.type !== 'simple_dt'} className="odh-container">
                <div className="form-group">
                  <div className="checkbox">
                    <label className="">
                      <input type="checkbox" disabled={!DTS.length} label="Выбрать все" checked={!fail_list.length} onChange={this.handleCheckbox.bind(this, 'dt', DTS.map(o => o.value).join(','))} />
                      <span>Выбрать все</span>
                    </label>
                  </div>
                </div>
                <Field
                  type="select"
                  label="Список выбранных ДТ"
                  multi
                  options={DTS}
                  value={object_list.map(o => o.object_id).join(',')}
                  onChange={this.onGeozoneSelectChange.bind(this, 'dt')}
                  error={errors.object_list}
                />
              </Div>
              <Div hidden={route.type === 'points'}>
                <CheckList
                  name={route.type === 'simple_dt' ? 'ДТ' : 'ОДХ'}
                  list={list}
                  draw_list={draw_list}
                  fail_list={fail_list}
                  checkRoute={route.type === 'mixed' ? this.checkRoute : null}
                  error={errors.object_list}                  
                />
              </Div>
              <Div className="destination-points" hidden={route.type !== 'points'}>
                {object_list.map((o, i) => {
                  const label = `Пункт назначения №${i + 1} ${o.name ? `( ${o.name} )` : ''}`;
                  return (
                    <Div className="destination-point" key={i}>
                      <div className="form-group">
                        <label className=""><span>{label}</span></label>
                        <FormControl type="text" label={label} value={o.name} onChange={this.onObjectNameChange.bind(this, i)} />
                      </div>
                      <Button className="inline-block" onClick={this.removeObject.bind(this, i)}><Glyphicon glyph="remove" /></Button>
                    </Div>
                  );
                })}
              </Div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

RouteCreating.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(RouteCreating, ['routes', 'geoObjects']);

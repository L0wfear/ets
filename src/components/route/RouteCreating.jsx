import * as React from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import {
  Row, Col, FormControl, Button, Glyphicon,
} from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import MapWrap from 'components/ui/input/map/MapWrap.tsx';
import cx from 'classnames';

import { polyState } from 'constants/polygons.js';
import CheckList from './CheckList.jsx';

@autobind
class RouteCreating extends React.Component {
  static get propTypes() {
    return {
      route: PropTypes.object,
      onChange: PropTypes.func,
      geozonePolys: PropTypes.object,
      manual: PropTypes.bool,
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
    const shwoBridge = flux.getStore('session').getPermission('bridges.list');

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
    const odhs = v;

    if (odhs.length > object_list.length) {
      const object_id = _.last(odhs);
      object_list.push({
        object_id: parseInt(object_id, 10), type, name: geozonePolys[object_id].name, state: polyState.ENABLED,
      });
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
    Object.entries(polys).forEach(([id, poly_data]) => {
      if (!v.includes(id) && poly_data.state === polyState.SELECTABLE && poly_data.old) {
        delete polys[id];
      }
    });
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
      object_list[objectIndex] = {
        object_id: parseInt(id, 10), type, name, state,
      };
    } else {
      object_list.push({
        object_id: parseInt(id, 10), type, name, state,
      });
    }

    this.props.onChange('object_list', object_list);
  }

  checkRoute() {
    const { flux } = this.context;
    if (!this.props.route.input_lines.length) {
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
        object_list.push({
          object_id: e, type, name: geozonePolys[e].name, state: polyState.ENABLED,
        });
        polys[e].state = polyState.ENABLED;
      });
    } else {
      object_list = [];
      _.forEach(polys, e => (e.state = polyState.SELECTABLE));
    }
    Object.entries(polys).forEach(([id, poly_data]) => {
      if (!v.includes(id) && poly_data.state === polyState.SELECTABLE && poly_data.old) {
        delete polys[id];
      }
    });

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
    if (polys[id].state === 1 && polys[id].old) {
      delete polys[id];
    }

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
    const { route: { input_lines: [...input_lines] = [] } } = this.props;

    input_lines.push(drawObjectNew);

    this.props.onChange('input_lines', input_lines);
  }

  handleDrawFeatureClick = ({ index, nextState }) => {
    const input_lines = _.cloneDeep(this.props.route.input_lines);

    input_lines[index].state = nextState;

    this.props.onChange('input_lines', input_lines);
  }

  handleRemoveLastDrawFeature = () => {
    const { route: { input_lines: [...input_lines] = [] } } = this.props;
    input_lines.pop();

    this.props.onChange('input_lines', input_lines);
  }

  render() {
    const [errors = []] = [this.props.formErrors];

    const { route = {} } = this.props;
    const { bridgesPolys = {} } = this.state;
    const {
      object_list = [],
      input_lines = [],
      polys = {},
    } = route;
    const [draw_list = []] = [route.draw_odh_list];
    const MapPolys = Object.assign({}, bridgesPolys, polys);
    const list = object_list.filter(o => o.type) || [];

    const fail_list = _.map(polys, (v, k) => ({
      name: v.name,
      object_id: parseInt(k, 10),
      type: 'odh',
      state: v.state,
    })).filter(o => (
      !list.concat(draw_list)
        .find(e => e.object_id === o.object_id)
    ));

    const POLYS_OPTIONS = Object.entries(polys).reduce((newArr, [id, { name }]) => [
      ...newArr,
      { value: id, label: name },
    ], []);

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
                drawObjectList={input_lines}
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
                    <label className={cx({ 'not-allowed': !POLYS_OPTIONS.length })} disabled={!POLYS_OPTIONS.length}>
                      <input type="checkbox" label="Выбрать все" disabled={!POLYS_OPTIONS.length} checked={POLYS_OPTIONS.length && !fail_list.length} onChange={this.handleCheckbox.bind(this, 'odh', POLYS_OPTIONS.map(o => o.value).join(','))} />
                      <span>Выбрать все</span>
                    </label>
                  </div>
                </div>
                <Field
                  id="odh"
                  type="select"
                  label="Список выбранных ОДХ"
                  multi
                  options={POLYS_OPTIONS}
                  value={object_list.map(o => o.object_id).join(',')}
                  onChange={this.onGeozoneSelectChange.bind(this, 'odh')}
                  error={errors.object_list}
                />
              </Div>
              <Div hidden={route.type !== 'simple_dt'} className="odh-container">
                <div className="form-group">
                  <div className="checkbox">
                    <label htmlFor="route-select-all">
                      <input id="route-select-all" type="checkbox" disabled={!POLYS_OPTIONS.length} label="Выбрать все" checked={!fail_list.length} onChange={this.handleCheckbox.bind(this, 'dt', POLYS_OPTIONS.map(o => o.value).join(','))} />
                      <span>Выбрать все</span>
                    </label>
                  </div>
                </div>
                <Field
                  id="object_list_ids"
                  type="select"
                  label="Список выбранных ДТ"
                  multi
                  options={POLYS_OPTIONS}
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
                  disabledCheckRoute={!input_lines || !input_lines.length}
                />
              </Div>
              <Div className="destination-points" hidden={route.type !== 'points'}>
                {object_list.map((o, i) => {
                  const label = `Пункт назначения №${i + 1} ${o.name ? `( ${o.name} )` : ''}`;
                  return (
                    <Div className="destination-point" key={i}>
                      <div>
                        <div className="form-group">
                          <label className=""><span>{label}</span></label>
                          <FormControl type="text" label={label} value={o.name} className={cx({ 'has-error': !o.name })} onChange={this.onObjectNameChange.bind(this, i)} />
                        </div>
                        <Button className="inline-block" onClick={this.removeObject.bind(this, i)}><Glyphicon glyph="remove" /></Button>
                      </div>
                      <Div hidden={!!o.name} className="error">{`Имя Пункт назначения №${i + 1} должно быть заполнено`}</Div>
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
  flux: PropTypes.object,
};

export default connectToStores(RouteCreating, ['routes', 'geoObjects']);

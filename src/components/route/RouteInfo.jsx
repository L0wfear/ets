import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';
import Div from 'components/ui/Div';
import PolyMap from '../map/PolyMap';
import CheckList from './CheckList';

export default
@connectToStores(['geoObjects'])
class RouteInfo extends React.Component {

  static get propTypes() {
    return {
      route: PropTypes.object,
      mapOnly: PropTypes.bool,
      geozonePolys: PropTypes.object,
    };
  }

  static get contextTypes() {
    return {
      flux: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props);

    const sessionStore = context.flux.getStore('session');

    this.state = {
      zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
      center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozones();
  }

  onFeatureClick = (feature, ev, map) => {
    const { name, type } = feature.getProperties();

    if (name) {
      map.popup.show(ev.coordinate, `<div class="header">${type === 'dt' ? 'ДТ' : 'ОДХ'}: ${name}</div>`);
    }
  }

  render() {
    const { route, geozonePolys = {}, mapOnly } = this.props;
    const { object_list = [], draw_object_list = [], input_lines = [] } = route;
    const manual = route.type === 'mixed';

    const polys = _(_.cloneDeep(object_list))
      .map((object) => {
        if (geozonePolys[object.object_id] && route.type !== 'points') {
          object.shape = geozonePolys[object.object_id].shape;
        }
        return object;
      })
      .keyBy((o) => {
        if (route.type === 'points') {
          return o.coordinates.join(',');
        }
        return o.object_id;
      })
      .value();
    const odh_list = route.odh_list || object_list.filter(o => o.type);

    return (
      <Div style={{ marginTop: 18 }}>
        <Div className="route-name" hidden={mapOnly}><b>{route.name}</b></Div>
        <Div>
          <Row>
            <Col md={this.props.onlyMap ? 12 : 8}>
              <Div className="route-creating">
                <PolyMap
                  keyGlobal={this.props.keyGlobal}
                  rotationAngle={this.props.rotationAngle}
                  onFeatureClick={this.onFeatureClick}
                  zoom={this.state.zoom}
                  center={this.state.center}
                  object_list={route.object_list}
                  draw_object_list={input_lines}
                  polys={polys}
                  objectsType={route.type}
                  manual={manual}
                />
              </Div>
            </Col>

            <Col md={this.props.onlyMap ? 0 : 4}>
              <CheckList showSelectable list={odh_list} draw_list={draw_object_list} />
              <Div style={{ marginTop: 20 }} hidden={route.type !== 'points'}>
                {route.object_list.map((o, i) => {
                  const label = `Пункт назначения №${i + 1} ${o.name ? `(${o.name})` : ''}`;
                  return (
                    <div key={i} className="form-group">
                      <label className="">
                        <span>{label}</span>
                      </label>
                    </div>
                  );
                })}
              </Div>
            </Col>

          </Row>
        </Div>
      </Div>
    );
  }
}

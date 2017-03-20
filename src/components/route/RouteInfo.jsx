import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col, Input } from 'react-bootstrap';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import PolyMap from '../map/PolyMap.jsx';
import CheckList from './CheckList.jsx';

@connectToStores(['geoObjects'])
@autobind
export default class RouteInfo extends Component {

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

  onFeatureClick(feature, ev, map) {
    const { name } = feature.getProperties();
    if (name) {
      map.popup.show(ev.coordinate, `<div class="header">ОДХ: ${name}</div>`);
    }
  }

  render() {
    const { route, geozonePolys = {}, mapOnly } = this.props;
    const { object_list = [], draw_object_list = [] } = route;
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
            <Col md={8}>
              <Div className="route-creating">
                <PolyMap
                  onFeatureClick={this.onFeatureClick}
                  zoom={this.state.zoom}
                  center={this.state.center}
                  object_list={route.object_list}
                  draw_object_list={draw_object_list}
                  polys={polys}
                  objectsType={route.type}
                  manual={manual}
                />
              </Div>
            </Col>

            <Col md={4}>
              <CheckList showSelectable list={odh_list} draw_list={draw_object_list} />
              <Div style={{ marginTop: 20 }} hidden={route.type !== 'points'}>
                {route.object_list.map((o, i) => {
                  const label = `Пункт назначения №${i + 1} ${o.name ? `(${o.name})` : ''}`;
                  return <Input key={i} label={label} />;
                })}
              </Div>
            </Col>

          </Row>
        </Div>
      </Div>
    );
  }
}

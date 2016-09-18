import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col, Input } from 'react-bootstrap';
import PolyMap from '../map/PolyMap.jsx';
import ODHList from './ODHList.jsx';
import Div from 'components/ui/Div.jsx';

@autobind
export default class RouteInfo extends Component {

  static get propTypes() {
    return {
      route: PropTypes.object,
      mapOnly: PropTypes.bool,
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

  onFeatureClick(feature, ev, map) {
    const { name } = feature.getProperties();
    if (name) {
      map.popup.show(ev.coordinate, `<div class="header">ОДХ: ${name}</div>`);
    }
  }

  render() {
    const route = this.props.route;
    const { object_list = [] } = route;
    const manual = route.type === 'vector';
    const polys = object_list.map(({ shape, name, state }) => ({ shape, name, state }));

    const odh_list = route.odh_list || object_list.filter(o => o.type);

    return (
      <Div style={{ marginTop: 18 }}>
        <Div className="route-name" hidden={this.props.mapOnly}><b>{route.name}</b></Div>
        <Div>
          <Row>

            <Col md={8}>
              <Div className="route-creating">
                <PolyMap
                  onFeatureClick={this.onFeatureClick}
                  zoom={this.state.zoom}
                  center={this.state.center}
                  polys={polys}
                  manual={manual}
                />
              </Div>
            </Col>

            <Col md={4}>
              <ODHList showSelectable odh_list={odh_list} />
              <Div style={{ marginTop: 20 }} hidden={route.type !== 'points'}>
                {route.object_list.map((o, i) => {
                  const label = `Пункт назначения №${i + 1} ${o.name ? '(' + o.name + ')' : ''}`;
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

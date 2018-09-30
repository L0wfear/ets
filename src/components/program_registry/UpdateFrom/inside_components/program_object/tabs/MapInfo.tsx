import * as React from 'react';
import { Col } from 'react-bootstrap';

import { IPropsMapInfo } from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo.h';
import RouteCreatingMap from 'components/route/form/map/RouteCreatingMap';

class MapInfo extends React.Component<IPropsMapInfo, any> {
  handleFeatureClick = ({ id }) => {
    this.props.handleFeatureClick({ id });
    return;
  }
  startDraw = () => {
    // this.props.startDraw();
  }
  handlePointAdd = ({ newPointObject }) => {
    /* Смотри routeCreating */
  }
  handleDrawFeatureAdd = ({ drawObjectNew }) => {
    this.props.handleDrawFeatureAdd({ drawObjectNew });
  }
  handleDrawFeatureClick = ({ index, state }) => {
    this.props.handleDrawFeatureClick({ index, state });
  }
  handleRemoveLastDrawFeature = () => {
    this.props.handleRemoveLastDrawFeature();
  }
  setManualOnFalse = () => {
    const { isPermitted } = this.props;
    if (isPermitted) {
      this.props.setManualOnFalse();
    }
  }
  setManualOnTrue = () => {
    const { isPermitted } = this.props;
    if (isPermitted) {
      this.props.setManualOnTrue();
    }
  }

  render() {
    const {
      isPermitted,
      isPermittedMap,
      manual = false,
      polys,
      objectsType,
      objectList,
      drawObjectList,
    } = this.props;

    return (
      <div>
        <Col md={12}>
          <Col md={12}>
            <label>Отрисовка границ ремонта</label>
          </Col>
          <Col md={12} style={{ marginBottom: 15 }}>
            <Col md={6} onClick={this.setManualOnFalse} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={!manual}
              />Отрисовать весь объект
            </Col>
            <Col md={6} onClick={this.setManualOnTrue} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={manual}
              />Отрисовать границы ремонта
            </Col>
          </Col>
          <Col md={12}>
            <div style={{ minHeight: 500 }}>
              <RouteCreatingMap
                disabled={!isPermittedMap}
                objectsType={objectsType}
                manual={manual}
                polys={polys}
                objectList={objectList}
                drawObjectList={drawObjectList}
                handleFeatureClick={this.handleFeatureClick}
                handlePointAdd={this.handlePointAdd}
                handleDrawFeatureAdd={this.handleDrawFeatureAdd}
                handleDrawFeatureClick={this.handleDrawFeatureClick}
                handleRemoveLastDrawFeature={this.handleRemoveLastDrawFeature}
              />
            </div>
          </Col>
        </Col>
      </div>
    );
  }
}

export default MapInfo;

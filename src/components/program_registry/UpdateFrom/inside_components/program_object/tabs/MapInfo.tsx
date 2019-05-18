import * as React from 'react';

import { IPropsMapInfo } from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo.h';
import RouteCreatingMap from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/RouteCreatingMap';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
  handleAddDrawLines = (newInputLines) => {
    this.props.handleDrawFeatureAdd(newInputLines);
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
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Col md={12}>
            <label>Отрисовка границ ремонта</label>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12} style={{ marginBottom: 15 }}>
            <EtsBootstrap.Col md={6} onClick={this.setManualOnFalse} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={!manual}
              />Отрисовать весь объект
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6} onClick={this.setManualOnTrue} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={manual}
              />Отрисовать границы ремонта
            </EtsBootstrap.Col>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <div style={{ minHeight: 500 }}>
              <RouteCreatingMap
                objectsType={objectsType}
                manual={manual}
                canDraw={manual}
                polys={polys}
                objectList={objectList}
                drawObjectList={drawObjectList}
                handleFeatureClick={this.handleFeatureClick}
                handlePointAdd={this.handlePointAdd}
                handleAddDrawLines={this.handleAddDrawLines}
                handleDrawFeatureClick={this.handleDrawFeatureClick}
                handleRemoveLastDrawFeature={this.handleRemoveLastDrawFeature}
                handleClickOnStartDraw={this.setManualOnTrue}
                disabled={!isPermittedMap}
              />
            </div>
          </EtsBootstrap.Col>
        </EtsBootstrap.Col>
      </div>
    );
  }
}

export default MapInfo;

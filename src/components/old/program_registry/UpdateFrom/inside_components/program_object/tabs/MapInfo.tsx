import * as React from 'react';

import { IPropsMapInfo } from 'components/old/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo.h';
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
    this.props.handleAddDrawLines(newInputLines);
  }
  handleDrawFeatureClick = ({ index, state }) => {
    this.props.handleDrawFeatureClick({ index, state });
  }
  handleRemoveLastDrawFeature = () => {
    this.props.handleRemoveLastDrawFeature();
  }

  setManualOnTrue = () => {
    const { isPermitted } = this.props;
    if (isPermitted) {
      if (this.props.manual) {
        this.props.setManualOnTrue();
      } else {
        this.props.setManualOnTrue();
      }
    }
  }

  setIsDrawAllObjectOnFalse = () => {
    const { isPermitted } = this.props;
    if (isPermitted) {
      this.props.setIsDrawAllObjectOnFalse();
    }
  }
  setIsDrawAllObjectOnTrue = () => {
    const { isPermitted } = this.props;
    if (isPermitted) {
      this.props.setIsDrawAllObjectOnTrue();
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
      isNotDrawAllObject,
    } = this.props;

    return (
      <div>
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Col md={12}>
            <label>Отрисовка границ ремонта</label>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12} style={{ marginBottom: 15 }}>
            <EtsBootstrap.Col md={6} onClick={this.setIsDrawAllObjectOnFalse} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={!isNotDrawAllObject}
                style={{marginRight: 5}}
              />Отрисовать весь объект
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6} onClick={this.setIsDrawAllObjectOnTrue} style={{ display: 'flex', cursor: isPermitted ? 'pointer' : 'not-allowed' }}>
              <input
                disabled={!isPermitted}
                type="radio"
                checked={isNotDrawAllObject}
                style={{marginRight: 5}}
              />Отрисовать границы ремонта
            </EtsBootstrap.Col>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <div style={{ minHeight: 500 }}>
              <RouteCreatingMap
                objectsType={objectsType}
                manual={manual}
                canDraw={isNotDrawAllObject}

                focusOnSelectedGeo={this.props.focusOnSelectedGeo}
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

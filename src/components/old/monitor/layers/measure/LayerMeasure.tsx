import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Draw from 'ol/interaction/Draw';
import { omit } from 'lodash';
import Map from 'ol/Map';

import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import Overlay from 'components/new/ui/map/overlay/Overlay';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import {
  monitorPageToggleMeasureActive,
  monitorPageFalseMeasureActive,
} from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { compose } from 'recompose';
import { getStyleForLineMeasure } from 'components/old/monitor/layers/measure/feature-style';

import {
  ButtonDraw,
  OverlayInsideMeasureContainer,
  EtsOverlayMeasureContainer,
  EtsOverlayMeasureTitleContainer,
  EtsTriangleMeasure,
} from 'components/old/monitor/layers/measure/styled/styled';
import { ButtonContainer } from '../polygon_buffer/styled/styled';
import GeometryType from 'ol/geom/GeometryType';

type PropsLayerParkingPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  getVectorSource: ETSCore.Map.InjectetLayerProps.FuncGetVectorSource,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  map: Map;

  monitorPageToggleMeasureActive: any;
  monitorPageFalseMeasureActive: any;
  measureActive: boolean;
  drawActiveAll: boolean;
};

type OneLine = {
  length: number;
  points: any[];
};

type StateLayerParkingPoints = {
  lines: OneLine[];
  interactionDraw: Draw | void;
  activeDraw: boolean;
};

/**
 * @todo перевести на LayerLayerDraw
 */
class LayerParkingPoints extends React.PureComponent<PropsLayerParkingPoints, StateLayerParkingPoints> {
  state = {
    lines: [],
    interactionDraw: null,
    activeDraw: false,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'MeasureLines', zIndex: 100, renderMode: 'vector' }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
    });
  }

  componentWillUnmount() {
    this.props.removeLayer();
    if (this.props.measureActive) {
      this.props.monitorPageFalseMeasureActive();
    }
  }

  toggleMeasureActive = () => {
    this.props.monitorPageToggleMeasureActive();

    if (!this.props.measureActive) {
      const interactionDraw = new Draw({
        source: this.props.getVectorSource(),
        type: GeometryType.LINE_STRING,
        style: getStyleForLineMeasure({ type: 'template' }),
      });

      this.setOnForDraw(interactionDraw);
    } else {
      this.props.map.removeInteraction(this.state.interactionDraw);
      this.setState({ interactionDraw: null });
    }
  }

  drawEnd = () => {
    const { lines } = this.state;
    const linesLength = lines.length;

    this.setState({
      activeDraw: false,
      lines: lines.map((lineData, index) => {
        if (index !== linesLength - 1) {
          return lineData;
        }

        const style = getStyleForLineMeasure({ type: 'diffColor' });
        lineData.feature.setStyle(style);
        const endPoint = new Feature({
          geometry: new Point(lineData.feature.getGeometry().getLastCoordinate()),
        });
        endPoint.setStyle(style);
        this.props.addFeaturesToSource(endPoint);

        return {
          ...lineData,
          endPoint,
          overlayData: {
            ...lineData.overlayData,
            active: false,
          },
        };
      }),
    });
  }

  setOnForDraw = (interactionDraw) => {
    interactionDraw.on(
      'drawstart',
      (event) => {
        const feature = event.feature;
        const listener = feature.getGeometry().on(
          'change',
          (eventInside) => (
            this.handleChangeLastFeature(eventInside, feature)
          ),
        );

        feature.set('notSelected', true);

        this.setState({
          lines: [
            ...this.state.lines,
            {
              feature,
              listener,
              overlayData: {
                active: true,
                coords_msk: (feature.getGeometry() as any).getLastCoordinate(),
                lineStringLength: 0,
              },
            },
          ],
          activeDraw: true,
        });
      },
    );

    interactionDraw.on(
      'drawend',
      this.drawEnd,
    );

    this.props.map.addInteraction(interactionDraw);
    this.setState({ interactionDraw });
  }

  handleChangeLastFeature = (event, feature) => {
    const { lines } = this.state;
    const linesLength = lines.length;

    this.setState({
      lines: lines.map((lineData, index) => {
        if (index !== linesLength - 1) {
          return lineData;
        }

        return {
          ...lineData,
          overlayData: {
            active: true,
            coords_msk: feature.getGeometry().getLastCoordinate(),
            lineStringLength: feature.getGeometry().getLength(),
          },
        };
      }),
    });
  }

  handleClickRemove = () => {
    if (!this.state.activeDraw) {
      this.setState({
        lines: this.state.lines.reduceRight(({ newLines, alreadyCheckLastVisible }, lineData) => {
          if (!lineData.hidden && !alreadyCheckLastVisible && lineData.feature && lineData.endPoint) {
            const { feature, endPoint } = lineData;
            const coordinates = feature.getGeometry().getCoordinates();

            if (coordinates.length > 2) {
              feature.getGeometry().setCoordinates(coordinates.slice(0, -1));
              const lastCoordinates = feature.getGeometry().getLastCoordinate();

              endPoint.getGeometry().setCoordinates(lastCoordinates);

              return {
                newLines: [
                  {
                    ...lineData,
                    feature,
                    endPoint,
                    overlayData: {
                      ...lineData.overlayData,
                      coords_msk: lastCoordinates,
                      lineStringLength: feature.getGeometry().getLength(),
                    },
                  },
                  ...newLines,
                ],
                alreadyCheckLastVisible: true,
              };
            } else {
              this.props.removeFeaturesFromSource([
                lineData.feature,
                lineData.endPoint,
              ]);

              return {
                newLines: [
                  {
                    ...lineData,
                    hidden: true,
                    feature,
                    endPoint,
                    overlayData: {
                      ...lineData.overlayData,
                      coords_msk: [-99999999, -99999999],
                      lineStringLength: 0,
                    },
                  },
                  ...newLines,
                ],
                alreadyCheckLastVisible: true,
              };
            }
          }
          return {
            newLines: [
              lineData,
              ...newLines,
            ],
            alreadyCheckLastVisible,
          };
        }, { newLines: [], alreadyCheckLastVisible: false }).newLines,
      });
    } else {
      if (this.state.interactionDraw) {
        this.state.interactionDraw.removeLastPoint();
      }
    }
  }

  checkRemoveFromActiveDraw = () => {
    if (this.state.activeDraw) {
      return this.state.lines.filter(({ hidden }) => !hidden).slice(-1)[0].feature.getGeometry().getCoordinates().length <= 2;
    } else {
      return !this.state.lines.some(({ hidden }) => !hidden);
    }
  }

  render() {
    return (
      <>
        {
          this.state.lines.map(({ overlayData: { lineStringLength, active, ...overlayData } }, index) => (
            <Overlay
              key={index}
              OverlayInside={OverlayInsideMeasureContainer}
              EtsOverlay={EtsOverlayMeasureContainer}
              EtsOverlayTitle={EtsOverlayMeasureTitleContainer}
              EtsTriangle={EtsTriangleMeasure}
              active={active}
              title={lineStringLength < 1000 ? `${lineStringLength.toFixed(3)} м.` : `${(lineStringLength / 1000).toFixed(3)} км.`}
              map={this.props.map}
              coordsMsk={overlayData.coords_msk}
            />
          ))
        }
        <ButtonContainer>
          <ButtonDraw disabled={this.state.activeDraw || this.props.drawActiveAll} onClick={this.toggleMeasureActive} />
          <EtsBootstrap.Button disabled={this.checkRemoveFromActiveDraw()} onClick={this.handleClickRemove}>
            <EtsBootstrap.Glyphicon glyph="remove" />
          </EtsBootstrap.Button>
        </ButtonContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  drawActiveAll: Object.values(omit({...state.monitorPage.drawActive}, ['all', 'measureActive'])).some((value: boolean) => value),
  measureActive: state.monitorPage.drawActive.measureActive,
});

const mapDispatchToProps = (dispatch) => ({
  monitorPageToggleMeasureActive: () => (
    dispatch(
      monitorPageToggleMeasureActive(),
    )
  ),
  monitorPageFalseMeasureActive: () => (
    dispatch(
      monitorPageFalseMeasureActive(),
    )
  ),
});

export default compose<any, any>(
  withLayerProps({
    map: true,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(LayerParkingPoints);

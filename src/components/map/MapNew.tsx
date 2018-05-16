import * as React from 'react';
// import { withRouter } from 'react-router-dom';
// import * as queryString from 'query-string';

import { defaultZoom } from 'utils/ol';

import { PROJECTION, ArcGisLayer, projectToPixel } from './MskAdapter.js';

// @withRouter
export default class OpenLayersMap extends React.Component<any, any> {
  _container: HTMLDivElement;

  constructor(props, context) {
    super(props, context);

    // const { location: { search } } = props;

    const {
      center,
      zoom = props.zoom,
    } = props;
    // } = queryString.parse(search);

    const initialView = new ol.View({
      center: center ? center.split(',').map(c => Number.parseFloat(c)) : props.center,
      zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent(),
    });

    const map = new ol.Map({
      view: initialView,
      controls: [defaultZoom],
      layers: [ArcGisLayer],
      loadTilesWhileAnimating: true,
    });

    map.set('parent', this);

    this.state = {
      zoom: null,
      map,
    };
  }

  componentDidMount() {
    this.state.map.setTarget(this._container);
    this.state.map.on('pointermove', this.mouseEvent);
    this.state.map.on('singleclick', this.mouseEvent);
    this.state.map.on('moveend', this.onMoveEnd);
  }

  mouseEvent = e => {
    switch (e.type) {
      case 'singleclick': return this.singleClick(e);
      default: return this.pointerMove(e);
    }
  }
  singleClick({ pixel, coordinate, map }) {
    let wasClick = false;

    map.forEachLayerAtPixel(pixel, layer => {
      if (!wasClick && !!layer.get('customCanvas') && layer.get('checkSingleClick')(coordinate)) {
        wasClick = true;
      }
    });

    if (!wasClick) {
      map.forEachFeatureAtPixel(pixel, (feature, layer) => !!layer.get('customOl') && layer.get('handleSingleClick')(feature));
    }
  }

  // под вопросом
  // пока не появится ещё один слой
  pointerMove({ pixel, map }) {
    const hit = map.forEachLayerAtPixel(pixel, layer => !!layer.get('customCanvas') || !!layer.get('customOl'));
    this.state.map.getViewport().style.cursor = hit ? 'pointer' : '';
  }
  onMoveEnd = e => {
    const {
      location: { pathname },
      history,
    } = this.props;

    const zoom = e.map.getView().getZoom();
    const center = e.map.getView().getCenter();
    history.replace(`${pathname}?zoom=${zoom}&center=${center}`);

    console.info(`Центр карты: [${center}], зум: ${zoom}`);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  projectToPixel = coordinates => projectToPixel(this.state.map, coordinates);

  setContainer = node => this._container = node;

  /**
   * Докидываем свойства без создания дополнительного компонента
   * @todo remover flux
   */
  renderLayers = Layer => (
    <Layer.type
      {...Layer.props}
      map={this.state.map}
      projectToPixel={this.projectToPixel}
      flux={this.props.flux}
    />
  )

  render() {
    return (
      <div key="olmap">
        <div ref={this.setContainer} className="openlayers-container" />
        {React.Children.map(this.props.children, this.renderLayers)}
      </div>
    );
  }
}

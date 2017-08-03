import React, { PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

import Div from 'components/ui/Div.jsx';
import DrawControl from './DrawControl.js';

export default class Measure extends React.Component {
  static get propTypes() {
    return {
      map: PropTypes.object,
      setActiveMeasure: PropTypes.func,
    };
  }
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      isDrawing: false,
      ...this.setStyle('#ffcc33'),
      lineString: [],
      count: 0,
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  setStyle() {
    const { map } = this.props;

    const source = new ol.source.Vector();

    const vector = new ol.layer.Vector({
      source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 0.8)',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.8)',
          }),
        }),
      }),
    });

    map.addLayer(vector);

    return {
      source,
      vector,
    };
  }

  handleClickDraw = () => {
    const { active = false, isDrawing } = this.state;
    if (isDrawing) return;

    if (!active) {
      this.addInteraction();
    } else {
      this.removeInteraction();
    }
  }

  handleClickRemove = () => {
    const { isDrawing, draw, source } = this.state;

    const lineString = [...this.state.lineString];
    const lastItem = lineString.slice(-1)[0];

    if (isDrawing) {
      draw.removeLastPoint();
    } else if (!!lastItem && !lastItem.removeLastPoint()) {
      source.removeFeature(lastItem.feature);
      source.removeFeature(lastItem.lastMarkerFeature);

      lastItem.removeMeasureTooltip();

      lineString.pop();

      this.setState({ lineString });
    }
  }

  addInteraction() {
    const { source, count } = this.state;
    const { map } = this.props;

    const active = true;

    const draw = new DrawControl({
      map,
      source,
      count,
      addToSource: feature => source.addFeature(feature),
      addLineString: (newLineString) => {
        const { lineString = [] } = this.state;
        const copyLineString = [...lineString];
        copyLineString.push(newLineString);

        this.setState({ lineString: copyLineString });
      },
      setStatus: isDrawing => this.setState({ isDrawing }),
      setCount: c => this.setState({ count: c }),
    });

    draw.addToInteraction();
    this.props.setActiveMeasure(active);
    this.setState({ draw, active });
  }

  removeInteraction() {
    const { draw } = this.state;
    const active = false;

    draw.removeFromInteraction();

    this.props.setActiveMeasure(active);
    this.setState({ draw: {}, active });
  }

  render() {
    return (
      <Div className="ol-control ol-measure">
        <button className="draw-point" onClick={this.handleClickDraw} />
        <button className="rempove-step" onClick={this.handleClickRemove}><Glyphicon glyph="remove" /></button>
      </Div>
    );
  }
}

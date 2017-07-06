import React from 'react';
import { Glyphicon } from 'react-bootstrap';

import Div from 'components/ui/Div.jsx';
import DrawControl from './DrawControl.js';

export default class Measure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickDrawFB = () => this.handleClickDraw();
    this.handleClickRemoveFB = () => this.handleClickRemove();

    this.staticProps = Object.assign({ active: false }, this.setStyle('#ffcc33'));
    this.staticProps.map = props.map;
    this.staticProps.map.addLayer(this.staticProps.vector);

    this.list = {
      lineString: [],
      current: -1,
    };
    this.isDrawing = false;
  }

  shouldComponentUpdate() {
    return false;
  }

  setStyle() {
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

    return {
      source,
      vector,
    };
  }

  handleClickDraw() {
    if (!this.staticProps.active) {
      this.addInteraction();
      this.props.setActiveMeasure(true);
      this.staticProps.active = true;
    } else {
      this.removeInteraction();
      this.props.setActiveMeasure(false);
      this.staticProps.active = false;
    }
  }

  handleClickRemove() {
    if (this.isDrawing) {
      this.staticProps.draw.removeLastPoint();
    } else if (this.list.current >= 0) {
      const onePoint = this.list.lineString[this.list.current].removeLastPoint();
      if (!onePoint) {
        this.staticProps.source.removeFeature(this.list.lineString[this.list.current].feature);
        this.staticProps.source.removeFeature(this.list.lineString[this.list.current].lastMarkerFeature);

        this.list.lineString[this.list.current].removeMeasureTooltip();

        this.list.lineString.pop();
        this.list.current -= 1;
      }
    }
  }

  addInteraction() {
    this.staticProps.draw = new DrawControl({
      map: this.staticProps.map,
      source: this.staticProps.source,
      addToSource: feature => this.staticProps.source.addFeature(feature),
      addLineString: newLineString => (this.list.current = this.list.lineString.push(newLineString) - 1),
      setStatus: isDrawing => (this.isDrawing = isDrawing),
    });

    this.staticProps.draw.addToInteraction();
  }

  removeInteraction() {
    this.staticProps.draw.removeFromInteraction();
  }

  render() {
    return (
      <Div className="ol-control ol-measure">
        <button className="draw-point" onClick={this.handleClickDrawFB} />
        <button className="rempove-step" onClick={this.handleClickRemoveFB}><Glyphicon glyph="remove" /></button>
      </Div>
    );
  }
}

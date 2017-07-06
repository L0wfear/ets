import DrawLine from './DrawLineMeasure.js';

export default class DrawControl {
  constructor(props) {
    this.draw = new ol.interaction.Draw({
      source: props.source,
      type: 'LineString',
      style: this.getStyle(),
    });

    this.sketch = null;
    this.curLineString = {};
    this.listener = {};

    this.props = props;
    this.setOnForDraw();
  }

  getStyle() {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.1)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.8)',
        }),
      }),
    });
  }

  setOnForDraw() {
    this.draw.on(
      'drawstart',
      (e) => {
        this.sketch = e.feature;

        this.curLineString = new DrawLine(this.sketch);
        const measureToolTip = this.curLineString.createMeasureTooltip();
        this.props.map.addOverlay(measureToolTip);

        this.props.addLineString(this.curLineString);

        this.listener = this.sketch.getGeometry().on('change', () => this.curLineString.updateData());

        this.props.setStatus(true);
      });

    this.draw.on(
      'drawend',
      () => {
        this.props.addToSource(this.curLineString.endDraw())
        this.props.setStatus(false);

        this.sketch = null;
        ol.Observable.unByKey(this.listener);
      });
  }

  addToInteraction() {
    this.props.map.addInteraction(this.draw);
  }

  removeFromInteraction() {
    this.props.map.removeInteraction(this.draw);
  }
  removeLastPoint() {
    if (this.curLineString.checkCount()) {
      this.draw.removeLastPoint();
    }
  }
}

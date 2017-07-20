import DrawLine from './DrawLineMeasure.js';

export default class DrawControl {
  constructor(props) {
    this.props = props;
    const draw = new ol.interaction.Draw({
      source: props.source,
      type: 'LineString',
      style: new ol.style.Style({
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
      }),
    });

    this.state = {
      draw,
      sketch: {},
      listener: {},
      curLineString: {},
      count: 0,
    };

    this.setOnForDraw();
  }

  setOnForDraw() {
    const { draw } = this.state;

    draw.on(
      'drawstart',
      (e) => {
        const { count } = this.state;
        const sketch = e.feature;

        const curLineString = new DrawLine(sketch, count);
        const measureToolTip = curLineString.createMeasureTooltip();
        this.props.map.addOverlay(measureToolTip);

        this.props.addLineString(curLineString);

        const listener = sketch.getGeometry().on('change', () => curLineString.updateData());

        this.state = {
          ...this.state,
          sketch,
          listener,
          curLineString,
          count: count + 1,
        };

        this.props.setStatus(true);
      });

    draw.on(
      'drawend',
      () => {
        const { curLineString, listener } = this.state;
        const sketch = null;

        this.props.addToSource(curLineString.endDraw());
        this.props.setStatus(false);

        ol.Observable.unByKey(listener);

        this.state = {
          ...this.state,
          sketch,
          listener,
        };
      });
  }

  addToInteraction() {
    const { map } = this.props;
    const { draw } = this.state;

    map.addInteraction(draw);
  }

  removeFromInteraction() {
    const { map } = this.props;
    const { draw } = this.state;

    map.removeInteraction(draw);
  }
  removeLastPoint() {
    const { curLineString, draw } = this.state;
    if (curLineString.checkCount()) {
      draw.removeLastPoint();
    }
  }
}

export default class DrawLine {
  constructor(feature) {
    this.feature = feature;
    this.geom = feature.getGeometry();
    this.color = this.getRandomColor();

    this.isDrawn = false;
  }

  set title(val) {
    this.geomLength = val;

    const length = Math.round(val * 100) / 100;
    let output = 0;

    if (length > 1000) {
      output = [Math.round(length / 10) / 100, 'km'];
    } else {
      output = [Math.round(length * 100) / 100, 'm'];
    }

    this.measureTooltips.measureTooltipElement.innerHTML = output.join(' ');
  }

  set poisition(coor) {
    this.measureTooltips.measureTooltip.setPosition(coor);

    if (this.isDrawn) {
      this.moveMarker(coor);
    }
  }

  createMeasureTooltip() {
    const measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';

    const measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
    });
    this.measureTooltips = { measureTooltipElement, measureTooltip };

    return measureTooltip;
  }

  removeMeasureTooltip() {
    this.measureTooltips.measureTooltipElement.parentNode.removeChild(this.measureTooltips.measureTooltipElement);
  }

  updateData() {
    this.title = this.geom.getLength();
    this.poisition = this.geom.getLastCoordinate();
  }

  endDraw() {
    this.isDrawn = true;

    this.measureTooltips.measureTooltipElement.className = 'tooltip tooltip-static';
    this.measureTooltips.measureTooltip.setOffset([0, -7]);
    this.feature.setStyle(this.getStyleForLine());
    this.createMarker();

    return this.lastMarkerFeature;
  }

  getRandomColor() {
    const randomRGB = Array(3).fill(1).map(() => Math.round(Math.random() * 255));
    return ['rgb(', randomRGB.join(), ')'].join('');
  }

  getStyleForLine() {
    const color = this.color;

    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color,
        width: 2,
      }),
    });
  }

  getStyleForMarker() {
    const color = this.color;

    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color,
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0,0,0,0.1)',
          width: 2,
        }),
      }),
    });
  }

  removeLastPoint() {
    this.geom.setCoordinates(this.geom.getCoordinates().slice(0, -1));
    this.updateData();

    return !!+this.geomLength;
  }

  createMarker() {
    this.lastMarkerFeature = new ol.Feature(new ol.geom.Point([0, 0]));
    this.lastMarkerFeature.setStyle(this.getStyleForMarker());
    this.moveMarker(this.geom.getLastCoordinate());
  }

  moveMarker(position) {
    this.lastMarkerFeature.getGeometry().setCoordinates(position);
  }

  checkCount() {
    return this.geom.getCoordinates().length > 2;
  }
}

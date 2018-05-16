import { TRACK_COLORS, TRACK_SIMPLE_LINE_WIDTH } from 'constants/track.js';
import BaseCanvasLine from 'components/map/markersNew/canvas/BaseCanvasLine';

class TrackLine extends BaseCanvasLine {
  render(options) {
    const ctx = this.props.canvas.getContext('2d');
    const { line: { pointOne, pointTwo, color } } = this.state;
    const { difColor } = options;

    ctx.strokeStyle = difColor ? color : TRACK_COLORS.blue;
    ctx.lineWidth = TRACK_SIMPLE_LINE_WIDTH;
    ctx.lineCap = 'round';

    ctx.beginPath();

    const coordsOne = this.props.projectToPixel(pointOne.coords_msk);
    const coordsTwo = this.props.projectToPixel(pointTwo.coords_msk);

    ctx.moveTo(coordsOne.x, coordsOne.y);
    ctx.lineTo(coordsTwo.x, coordsTwo.y);

    ctx.stroke();
  }
}

export default TrackLine;

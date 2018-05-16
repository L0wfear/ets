import { connect } from 'react-redux';
import TrackLine from 'components/map/markersNew/TrackLine';
import CanvasLayer from 'components/map/layers/base/CanvasLayer';
import { getTrackLinesByFilter } from 'redux/selectors/oneCarInfo';
export function containsCoordinateLine(extent, coordinates) {
  const [[x1, y1], [x2, y2]] = coordinates;

  return (extent[0] <= x1 && x1 <= extent[2]) && (extent[1] <= y1 && y1 <= extent[3]) || (extent[0] <= x2 && x2 <= extent[2]) && (extent[1] <= y2 && y2 <= extent[3]);
}

const COLORS_ZOOM_THRESHOLD = 6;

@connect(
  state => ({
    trackLines: getTrackLinesByFilter(state),
  }),
)
class LineLayer extends CanvasLayer {
  componentDidMount() {
    this.addLayer();
  }

  withState() {
    return {
      lines: [],
    };
  }

  inheritComponentWillReceiveProps(props) {
    this.updateLines(props);
    this.triggerRender();
  }

  updateLines(props) {
    const { trackLines } = props;

    const lines = trackLines.map(line => new TrackLine({
      line,
      canvas: this.state.canvas,
      projectToPixel: this.props.projectToPixel,
    }));

    this.setState({ lines });
  }

  getMarkersInBounds(extent) {
    const { lines } = this.state;

    const optimizedLines = lines.reduce((newArr, line) => {
      // isVisible
      const { pointOne, pointTwo } = line.lineData;

      const coords = [
        [...pointOne.coords_msk],
        [...pointTwo.coords_msk],
      ];

      if (containsCoordinateLine(extent, coords)) {
          newArr.push(line);
      }

      return newArr;
    }, []).reverse();

    this.setState({ optimizedLines });

    return optimizedLines;
  }

  canvasFunction = (canvas, extent, pixelRatio) => {
    const { map } = this.props;
    const optimizedMarkersKeys = this.getMarkersInBounds(extent);
    const zoom = map.getView().getZoom();

    optimizedMarkersKeys.forEach(line => line.render({
      difColor: zoom > COLORS_ZOOM_THRESHOLD,
    }));

    return canvas;
  }
}

export default LineLayer;

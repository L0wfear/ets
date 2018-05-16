import { connect } from 'react-redux';

import CanvasLayer from 'components/map/layers/base/CanvasLayer';
import { openWs, closeWs, selectCar } from 'redux/modules/carsPoints.js';
import { loadCarInfo, loadTrack } from 'redux/modules/oneCarInfo';

import CarMarker from 'components/map/markersNew/CarMarker';
import { getIsShowGovNumber } from '/home/uoiasfy/all/chch/ets-frontend/src/redux/selectors/toolbar';
import {
  getcarsDict,
  getFiltredCarsPoint,
  getLastUpdateCars,
} from 'redux/selectors/carsPoints';
import { getToolbarFiltersCarsWithActiveCheck } from 'redux/selectors/toolbar';

export function containsCoordinate(extent, coordinates) {
  const x = coordinates[0];
  const y = coordinates[1];
  return (extent[0] <= x && x <= extent[2]) && (extent[1] <= y && y <= extent[3]);
}

@connect(
  state => ({
    carsDict: getcarsDict(state),
    carsData: getFiltredCarsPoint(state),
    lastUpdateCar: getLastUpdateCars(state),
    showGovNumber: getIsShowGovNumber(state),
    filtres: getToolbarFiltersCarsWithActiveCheck(state),
  }),
  {
    closeWs,
    loadTrack,
    loadCarInfo,
    openWs,
    selectCar,
  },
)
class CarsMarkers extends CanvasLayer {
  constructor(props) {
    super(props);

    // вынести данные сессии
    props.openWs(props.flux.getStore('session').getSession());
  }

  withState() {
    return {
      markers: {},
      optimizedMarkersKeys: [],
    };
  }

  componentDidMount() {
    this.addLayer();
  }

  inheritComponentWillReceiveProps(props) {
    this.updateMarkers(props);
    this.triggerRender();
  }

  componentWillUnmount() {
    this.props.closeWs();
  }

  /**
   * @override
   * Ищем машинку, которая попадает под координаты
   * Если нашли, то делаем её selected + return true
   * Если не нашли, то сообщаем, что точек нет
   */
  checkSingleClick = coordinate => {
    const { markers } = this.state;

    const selectedMarkerId = this.state.optimizedMarkersKeys.find(key => markers[key].contain(coordinate)) || '';

    if (selectedMarkerId) {
      this.props.selectCar(selectedMarkerId);

      this.props.loadCarInfo({
        car_id: this.props.carsDict[this.state.markers[selectedMarkerId].gps_code],
      })
      .then(() => {
        this.props.loadTrack({ id: selectedMarkerId });
      });
      return true;
    }

    return false;
  }

  /**
   * @todo
   * showGovNumber при true на 1 раз lastUpdateCar = Object.keys(carsData)
   */
  updateMarkers(props) {
    const {
      carsData = {},
      lastUpdateCar = [],
    } = props;

    const markers = {
      ...this.state.markers,
    };

    const whatUpdateIds = [...lastUpdateCar].reverse();

    whatUpdateIds.forEach(key => {
      if (markers[key]) {
        markers[key].update({
          point: carsData[key],
        });
      } else {
        markers[key] = new CarMarker({
          canvas: this.state.canvas,
          map: this.props.map,
          parent: this,
          point: carsData[key],
          projectToPixel: this.props.projectToPixel,
          typesIndex: this.props.typesIndex,
        });
      }
    });

    this.setState({
      markers,
    });
  }

  /**
   * Оптимизация
   * Ищет машинки в видимом прямоугольнике, чтобы уменьшить проходимый массив
   * @param extent - рамки
   * @todo - подумать как увеличить рамки, чтобы захватывать прямоугольник + ? пикселей (на границе точка резко исчезает)
   */
  getMarkersInBounds(extent) {
    const { markers } = this.state;
    let selected = '';

    const optimizedMarkersKeys = Object.entries(markers).reduce((newArr, [key, m]) => {
      // isVisible
      if (containsCoordinate(extent, m.coords)) {
        if (m.selected) {
          selected = key;
        } else {
          newArr.push(key);
        }
      }

      return newArr;
    }, []).reverse();

    if (selected) {
      optimizedMarkersKeys.push(selected);
    }

    this.setState({ optimizedMarkersKeys });

    return optimizedMarkersKeys;
  }

  /**
   * @override
   * Рендер машинок на карту
   */
  canvasFunction = (canvas, extent, pixelRatio) => {
    const {
      showGovNumber = true,
      filtres,
    } = this.props;

    const { markers } = this.state;
    const optimizedMarkersKeys = this.getMarkersInBounds(extent);
    optimizedMarkersKeys.forEach(key => markers[key].render({
      showGovNumber,
      filtres,
    }));

    return canvas;
  }
}

export default CarsMarkers;

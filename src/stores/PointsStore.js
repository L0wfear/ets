import { Store } from 'flummox';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import statuses from 'constants/statuses';
import config from '../config.js';
import ReconnectingWebSocket from '../vendor/ReconnectingWebsocket.js';

/**
 * Хранилище для объектов точек, отображаемых на карте
 * @extends {Store}
 */
@autobind
export default class PointsStore extends Store {

  /**
   * Начальное состояние хранилища
   * @type {Object}
   * @property {object|null} selected=null - выбранная точка
   * @property {object} points={} - индекс (объект по айдишникам) точек
   * @property {object} filter - настройки фильтрации точек
   * @property {array}  filter.status - выбранные для фильтрации статусы
   * @property {array}  filter.type - выбранные для фильтрации типы ТС
   * @property {array}  filter.owner - выбранные для фильтрации организации-владельцы ТС
   * @property {object} byStatus - количество точек со статусами
   * @property {object} byConnectionStatus - количество точек не на связи/на связи
   * @property {boolean} trackingMode=false - включен ли режим слежения за 1 точкой (= маркером, БНСО, ТС)
   * @property {boolean} showTrackingGradient=false - включено ли отображение цветов трека с градиентом
   * @property {boolean} isRenderPaused=false - включена ли приостановка рендеринга точек
   * @property {string|null} singleCarTrack=null - гос. номер ТС, если он есть то включается режим отображения только 1 точки
   * @property {array} singleCarTrackDates - даты для отображения трека по 1 БНСО
   */
  // static get initialState() {
  //   return
  // }

  /**
   * Создает хранилище
   * @param {object} flux - Реализация flux
   */
  constructor(flux) {
    super();
    this.flux = flux;

    const pointsActions = flux.getActions('points');
    const loginActions = flux.getActions('session');
    this.register(pointsActions.updatePoints, this.handleUpdatePoints);
    this.register(pointsActions.setFilter, this.handleSetFilter);
    this.register(pointsActions.selectPoint, this.handleSelectPoint);
    this.register(pointsActions.setTracking, this.setTracking);
    this.register(pointsActions.createConnection, this._handleCreateConnection);
    this.register(pointsActions.closeConnection, this._handleCloseConnection);
    this.register(pointsActions.setSingleCarTrack, this.handleSetSingleCarTrack);
    this.register(pointsActions.setSingleCarTrackDates, this.handleSetSingleCarTrackDates);

    this.register(loginActions.login, this.handleLogin);

    let currentUser;

    try {
      currentUser = JSON.parse(localStorage.getItem(global.CURRENT_USER)) || {};
    } catch (e) {
      currentUser = {};
    }

    this.initialState = {
      selected: null,
      points: {},
      filter: {
        status: statuses.map(s => s.id),
        type: [],
        owner: currentUser.company_id ? [currentUser.company_id] : [],
      },
      byStatus: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
      },
      byConnectionStatus: {
        0: 0,
        1: 0,
      },
      trackingMode: false,
      showTrackingGradient: false,
      isRenderPaused: false,
      singleCarTrack: null,
      singleCarTrackDates: [],
    };

    this.state = _.cloneDeep(this.initialState);
  }

  /**
   * Устанавливает соединение по WebSocket и устанавливает передачу данных из ws в {@link PointsStore#handleUpdatePoints}
   * так же устанавливает обработку ивентов WebSocket
   * @method
   * @private
   */
  _handleCreateConnection() {
    const token = this.flux.getStore('session').getSession();
    const wsUrl = `${config.ws}?token=${token}`;
    this.ws = new ReconnectingWebSocket(wsUrl, null);

    this.ws.onmessage = ({ data }) => {
      this.handleUpdatePoints(JSON.parse(data));
    };

    this.ws.onclose = () => {
      // console.warn('WEBSOCKET - Потеряно соединение с WebSocket, пытаемся переподключиться');
    };
    this.ws.onerror = () => {
      // console.error('WEBSOCKET - Ошибка WebSocket');
    };

    this.unpauseRendering();
  }

  /**
   * Закрывает соединение по WebSocket и возвращает state в initialState
   * @method
   * @private
   */
  _handleCloseConnection() {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
      this.ws = null;
    }
    this.setState(_.cloneDeep(this.initialState));
    this.pauseRendering();
  }

  handleSetSingleCarTrack(car_gov_number) {
    this.setState({ singleCarTrack: car_gov_number });
  }

  handleSetSingleCarTrackDates(dates) {
    this.setState({ singleCarTrackDates: dates });
  }

  handleUpdateTrack() {
    const points = Object.assign({}, this.state.points);
    if (this.state.singleCarTrack) {
      if (!this.state.selected) {
        _.map(points, (p) => {
          const car = p.car;
          if (car && car.gov_number === this.state.singleCarTrack && p.marker) { // заменить на car.gps_code
            p.marker.createTrack();
            p.marker.track.fetch(this.flux, this.state.singleCarTrackDates[0] || undefined, this.state.singleCarTrackDates[1] || undefined);
            this.handleSelectPoint(p);
          }
        });
      }
    }
  }

  /**
    * Обновляет точки
    * @method
    * @param {object} update - поступившие данные о точках
    *
    * @todo оптимизировать с https://github.com/mourner/rbush
    * https://github.com/mourner/rbush-knn
    */
  handleUpdatePoints(update) {
    if (this.isRenderPaused()) {
      return;
    }
    const points = Object.assign({}, this.state.points);

    // TODO отрефакторить механизм обработки получения точек для 1 БНСО

    for (const key in update) {
      const pointUpdate = update[key];

      // если информация в обновлении устарела - ничего не делаем
      if (key in points &&
        points[key].timestamp > pointUpdate.timestamp) {
        console.warn('got old info for point!');
        continue;
      }

      points[key] = Object.assign({}, points[key], pointUpdate);

      // TODO разобраться что это такое
      // HACK
      // whatever...
      /* if (points[key].speed !== 0 && this.state.points[key] && this.state.points[key].speed === 0) {
        points[key].coords = this.state.points[key].coords;
      }*/
    }

    const state = Object.assign({}, {
      points,
    }, this.countDimensions(points));

    this.setState(state);
  }

  /**
   * Расчет количества активных машин по статусам
   * @method
   * @param {object} points - точки
   * @return {object} dimensions - кол-во точек в разрезе статусов и активности
   * @return {object} dimensions.byStatus - кол-во точек в разрезе статусов
   * @return {object} dimensions.byConnectionStatus - кол-во точек в разрезе активности
   */
  countDimensions(points = this.state.points) {
    if (this.isRenderPaused()) {
      return;
    }

    const byStatus = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    const byConnectionStatus = {
      0: 0,
      1: 0,
    };
    for (const key in points) {
      const point = points[key];
      if (this.isPointVisible(point)) {
        byStatus[point.status]++;
        byConnectionStatus[point.connection_status]++;
      }
    }

    return {
      byStatus,
      byConnectionStatus,
    };
  }

  /**
   * Устанавливает фильтр
   * @method
   * @public
   * @param {object} update - измененный фильтр
   */
  handleSetFilter(update) {
    const filter = Object.assign({}, this.state.filter, update);
    const selected = this.state.selected;

    this.setState(Object.assign({}, { filter, selected }), () => {
      this.setState(Object.assign({}, this.countDimensions()));
    });
  }

  /**
   * Устанавливает выбранную точку
   * @method
   * @param {object|false} selected
   */
  handleSelectPoint(selected) {
    if (!!selected === false) {
      this.setState({
        selected: null,
      });
      return;
    }

    if (selected && !selected.car) {
      return;
    }

    this.setState({
      selected,
      trackingMode: false,
    });
  }

  /**
   * Обрабатывает логин пользователя, устанавливая в фильтр по владельцам
   * id стркутурного элемента организации пользователя
   * @method
   * @param {object} data - ответ с сервера
   * @param {object} data.payload - данные о пользователе
   */
  handleLogin({ payload }) {
    this.handleSetFilter({ owner: [payload.company_id] });
  }
  /**
   * Возвращает прошедшие фильтрацию точки
   * @method
   * @return {array} visiblePoints - прошедшие фильтрацию точки
   */
  getVisiblePoints() {
    const visiblePoints = [];
    for (const k in this.state.points) {
      const point = this.state.points[k];
      if (this.isPointVisible(point)) {
        visiblePoints.push(point);
      }
    }

    return visiblePoints;
  }

  /**
   * Определяет, доступна ли точка для отображения в соответствии с фильтром
   * интерфейс для PointsStore~_isPointVisible
   * @method
   * @public
   * @param {object} point - точка
   * @return {function} PointsStore~_isPointVisible
   */
  isPointVisible(point) {
    return this._isPointVisible(point, this.state.filter);
  }

  /**
   * Устанавливает значение режима слежения за точкой (БНСО, маркером, ТС)
   * @method
   * @public
   * @param {boolean} value - режим слежения
   */
  setTracking(value) {
    this.setState({
      trackingMode: value,
    });
  }

  /**
   * Устанавливает значение использования градиента при отрисовке
   * @todo перенести в более подходящее место
   * @method
   * @public
   * @param {boolean} flag - использовать градиент
   */
  handleSetShowGradient(flag) {
    this.setState({
      showTrackingGradient: flag,
    });
  }

  /**
   * Определяет, доступна ли точка для отображения в соответствии с фильтром
   * @method
   * @private
   * @param {object} point - точка
   * @param {object} filter - заданная конфигурация фильтрации
   * @return {boolean} visible - доступность точки для отображения
   */
  _isPointVisible(point, filter) {
    let visible = true;

    // Если точка не имеет за собой ТС, то она не должна отображаться на карте
    if (!point.car) {
      return false;
    }
    // В случае незаданной фильтрации возвращаем true
    if (!filter) {
      return visible;
    }
    // В случае если точка выбрана, она должна быть видима вне зависимости от
    // фильтрации
    if (this.state.selected !== null && point.id === this.state.selected.id) {
      return true;
    }
    // Фильтрация по статусу точки
    if (filter.status) {
      visible = visible && filter.status.indexOf(point.status) !== -1;
      if (!visible) {
        return false;
      }
    }
    // Фильтрация по номеру БНСО (GPS) или Гос. номеру ТС
    if (filter.bnso_gos) {
      const text = filter.bnso_gos.toLowerCase();
      visible = visible && (
        point.car.gps_code.toLowerCase().includes(text) ||
        point.car.gov_number.toLowerCase().includes(text)
      );
      if (!visible) {
        return false;
      }
    }
    // Фильтрация по типу ТС
    if (filter.type && filter.type.length > 0) {
      visible = visible && point.car && filter.type.indexOf(point.car.type_id) !== -1;
      if (!visible) {
        return false;
      }
    }
    // Фильтрация по организации-владельцу ТС
    if (filter.owner && filter.owner.length > 0) {
      visible = visible && point.car && filter.owner.indexOf(Number(point.car.owner_id)) !== -1;
      if (!visible) {
        return false;
      }
    }
    return visible;
  }

  /**
   * Возвращает маркер по выбранной точке
   * @method
   * @public
   * @return {Marker|null} marker - маркер
   */
  getSelectedMarker() {
    if (this.state.selected) {
      return this.state.selected.marker;
    }
    return null;
  }

  /**
   * Определяет выбрана ли какая-либо точка
   * @method
   * @public
   * @return {boolean} isSelected - выбрана ли какая-либо точка
   */
  hasMarkerSelected() {
    return this.state.selected !== false && this.state.selected !== null;
  }

  /**
   * Возвращает выбранную точку
   * @method
   * @public
   * @return {?Object} point - выбранная точка
   */
  getSelectedPoint() {
    return this.state.selected;
  }

  /**
   * Выключает обновление точек
   * @method
   * @public
   */
  pauseRendering() {
    this.setState({
      isRenderPaused: true,
    });
  }

  /**
   * Включает обновление точек
   * @method
   * @public
   */
  unpauseRendering() {
    this.setState({
      isRenderPaused: false,
    });
  }

  /**
   * Определяет включено ли обновление точек
   * @method
   * @public
   * @return {boolean} isRenderPaused - включено ли обновление точек
   */
  isRenderPaused() {
    return this.state.isRenderPaused;
  }

}

import * as React from 'react';
import { GeoJSON } from 'utils/ol.js';
import { getVectorArrowStyle } from 'constants/vectors.js';
import { polyStyles } from 'constants/polygons.js';
import { pointStyles } from 'constants/points.js';

export const setStyleFeatureByType = (type, feature, isSelected = false) => {
  switch (type) {
    case 'LineString': return getVectorArrowStyle(feature);
    case 'Point': return pointStyles[`geoobject${isSelected ? '-selected' : ''}`];
    default: return polyStyles[`geoobject${isSelected ? '-selected' : ''}`];
  }
};

class CanvasLayer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      popups: [],
      showPopupIds: {},
      vectorSource: null,
      olLayer: null,
      lastSelectedFeature: null,
      ...this.withState(),
    };
  }

  /**
   * При переопределении прокидывает свойства в state конструктора
   */
  withState() {
    return null;
  }

  /**
   * @param coordinate - координаты курсора
   * @returns true | false - произошёл ли клик по объекту слоя или нет
   * Переопределить в дочернем и чекать фичи/ маркеры
   * Вызывается в MapNew.tsx через layer.get('checkSingleClick')
   * Обязательно переопределить в дочернем компонете потому
   * @todo Возможно не очень удачно, но другого варианта с композицией я не вижу. Нужно одобрить и удалить данные коммент
   */
  handleSingleClick = featrue => {
    const { lastSelectedFeature } = this.state;
    if (lastSelectedFeature) {
      lastSelectedFeature.setStyle(setStyleFeatureByType(lastSelectedFeature.get('data').type, lastSelectedFeature));
    }

    featrue.setStyle(setStyleFeatureByType(featrue.get('type'), featrue, true));
    this.setState({ lastSelectedFeature: featrue });
    return featrue;
  }

  /**
   * @todo разобраться
   */
  addPopup() {
    const popups = [...this.state.popups];

    // Что-то тут не так
    const newPopup = new (ol.Overlay as any).Popup();
    this.props.map.addOverlay(newPopup);
    const lastPopupId = popups.push(newPopup) - 1;

    this.setState({
      popups,
      lastPopupId,
    });
    return lastPopupId;
  }

  /**
   * Отображает выбранные попап по координатам с html шаблоном
   * @param props obj
   * | coords - координаты попап
   * | html - шаблон html (ex. '<div>Hello</div>') [НЕ РЕАКТ КОМПОНЕНТ]
   * | id? - id попапа (по умолчанию - последний созданный)
   */
  showPopup(props) {
    const {
      coords,
      id = this.state.lastPopupId,
      html = '<div>test</div>',
    } = props;

    this.state.popups[id].show(coords, html);

    this.setState({
      showPopupIds: {
        ...this.state.showPopupIds,
        [id]: true,
      },
    });
  }

  /**
   * Скрывает выбранный попап
   * @param id? - id попапа (по умолчанию - последний созданный)
   */
  hidePopup(id = this.state.lastPopupId) {
    this.state.popups[id].hide();

    this.setState({
      showPopupIds: {
        ...this.state.showPopupIds,
        [id]: false,
      },
    });
  }

  /**
   * Скрывает все активные попапы
   */
  hideAllPopup() {
    const showPopupIds = Object.entries(this.state.showPopupIds).reduce((newObj, [id, status]) => {
      if (status) {
        this.state.popups[id].hide();
      }

      newObj[id] = false;

      return newObj;
    }, {});

    this.setState({ showPopupIds });
  }

  /**
   * Добавляет канвас слой
   */
  addLayer() {
    const vectorSource = new ol.source.Vector();
    const olLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    // Определяет, что это не слой с картой
    olLayer.set('custom', true);

    // Определяет функциию проверки клика по слою
    olLayer.set('handleSingleClick', this.handleSingleClick);
    olLayer.set('customOl', true);
    this.props.map.addLayer(olLayer);

    this.setState({ vectorSource, olLayer });
  }

  componentWillReceiveProps(props) {
    this.inheritComponentWillReceiveProps(props);
  }

  /**
   * @param props - пропсы
   * Для componentWillReceiveProps дочернего компонента
   */
  inheritComponentWillReceiveProps(props) {
    // для дочернего
  }

  /**
   * Удалить канвас слой
   */
  removeLayer() {
    this.props.map.removeLayer(this.state.olLayer);
    this.setState({ olLayer: null });
  }

  /**
   * callBack
   */
  addFeature = (poly, key) => {
    const feature = new ol.Feature({
      geometry: GeoJSON.readGeometry(poly.shape),
      type: poly.shape.type,
      name: poly.name,
      id: key,
      state: poly.state,
      data: poly,
    });

    feature.setStyle(setStyleFeatureByType(poly.shape.type, feature));

    this.state.vectorSource.addFeature(feature);
  }

  /**
   * Т.к. это компонент(1), который ничего не должен рендерить, то null
   */
  render() {
    return null;
  }
}

export default CanvasLayer;

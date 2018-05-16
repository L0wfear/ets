import * as React from 'react';

class CanvasLayer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const canvas = document.createElement('canvas');

    this.state = {
      canvas,
      popups: [],
      showPopupIds: {},
      canvasLayer: null,
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
   * @todo Возможно не очень удачно, но другого варианта с композицией я не вижу. Нужно одобрить и удалить данные коммент
   */
  checkSingleClick = coordinate => {
    return false;
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
    const { canvas } = this.state;

    const canvasLayer = new ol.layer.Image({
      source: new ol.source.ImageCanvas({
        canvasFunction: (extent: ol.Extent, resolution: number, pixelRatio: number, size: ol.Size) => {
          canvas.setAttribute('width', size[0]);
          canvas.setAttribute('height', size[1]);

          return this.canvasFunction(canvas, extent, pixelRatio);
        },
        projection: 'MSK77',
        ratio: 1,
      }),
    });
    //  zIndex: 9999,

    // Определяет, что это не слой с картой
    canvasLayer.set('customCanvas', true);

    // Определяет функциию проверки клика по слою
    canvasLayer.set('checkSingleClick', this.checkSingleClick);

    this.props.map.addLayer(canvasLayer);

    this.setState({ canvasLayer });
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
    this.props.map.removeLayer(this.state.canvasLayer);
    this.setState({ canvasLayer: null });
  }

  /**
   * @see canvasFunction https://openlayers.org/en/latest/apidoc/ol.source.ImageCanvas.html
   * @returns canvas
   * 1) Переопределяешь функцию
   * 2) С помощью canvas рисуешь всё что надо
   * 3) Возвращаешь canvas
   */
  canvasFunction = (canvas, extent, pixelRatio) => {
    return canvas;
  }

  /**
   * Тригер на обновления слоя
   * Получил новые данные. Сделал какие-нибудь манипуляции. Доволен, хочешь отрендерить изменения - вызываешь эту функцию
   */
  triggerRender() {
    this.state.canvasLayer.getSource().changed();
  }

  /**
   * Т.к. это компонент(1), который ничего не должен рендерить, то null
   */
  render() {
    return null;
  }
}

export default CanvasLayer;

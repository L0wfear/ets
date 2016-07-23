import React from 'react';
import ElementsList from './ElementsList.jsx';

/**
 * ElementsList с возможностью обрабатывать таблицы с выбором элементов
 * @extends React.Component
 */
export default class CheckableElementsList extends ElementsList {

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.state, {
      checkedElements: {}
    });

    this.tablePropsFunctions = [
      ...this.tablePropsFunctions,
      this.getCheckedProps.bind(this)
    ];
  }

  /**
   * Передает state в другой компонент
   * @todo избавиться от этой функции
   */
  stateChangeCallback() {
    if (typeof this.props.onListStateChange === 'function') {
      this.props.onListStateChange(this.state);
    }
  }

  /**
   * Выбирает/снимает выбор с элемента
   * @param {number} id - id выбранного элемента
   * @param {boolean} state - новое состояние выбора
   */
  checkElement(id, state) {
    const elements = _.cloneDeep(this.state.checkedElements);
    if (state) {
      elements[parseInt(id, 10)] = _.find(this.state.elementsList, e => e.id === parseInt(id, 10));
    } else {
      delete elements[id];
    }
    this.setState({checkedElements: elements}, this.stateChangeCallback.bind(this));
  }

  /**
   * Выбирает/снимает выбор со всех элементов
   * @param {object[]} rows - все элементы
   * @param {boolean} state - новое состояние выбора
   */
  checkAll(rows, state) {
    let checkedElements = _.cloneDeep(this.state.checkedElements);
    checkedElements = state ? rows : {};

    this.setState({checkedElements}, this.stateChangeCallback.bind(this));
  }

  /**
   * Удаляет выбранные элементы
   * метод вызывает {@link ElementsList#removeElement} в случае отсутствия выбранных элементов
   */
  removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') {
      return;
    }

    if (Object.keys(this.state.checkedElements).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;

      _.forEach(this.state.checkedElements, (element) => {
        this.removeElementAction(element[this.selectField]);
      });
			this.setState({
				checkedElements: {},
				selectedElement: null,
			});
    } else {
      this.removeElement();
    }
  }

  /**
   * Возвращает props, которые будут переданы в компонент Table списка
   * в {@link ElementsList#getTableProps}
   * @return {object} props - props, которые будут переданы в компонент
   */
  getCheckedProps() {
    return {
  		onAllRowsChecked: this.checkAll.bind(this),
  		onRowChecked: this.checkElement.bind(this),
  		checked: this.state.checkedElements
    }
  }

}

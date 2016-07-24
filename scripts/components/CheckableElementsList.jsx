import React from 'react';
import ElementsList from './ElementsList.jsx';
import { ButtonCreate, ButtonRead, ButtonDelete } from './ui/buttons/CRUD.jsx';

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
   * Закрывает форму и обнуляет выбранный элемент
   */
  onFormHide(clearCheckedElements) {
    this.setState({
      showForm: false,
      selectedElement: null,
      checkedElements: clearCheckedElements ? {} : this.state.checkedElements
    });
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
  		checked: this.state.checkedElements,
			multiSelection: true
    }
  }

  /**
   * @override
   */
  getTableProps() {
    const tableProps = super.getTableProps();

    return Object.assign(tableProps, this.getCheckedProps());
  }

  /**
   * Дополнительная проверка на наличие выбранных элементов
   * @override
   */
  checkDisabledDelete() {
    return super.checkDisabledDelete() && !this.hasCheckedElements();
  }

  /**
   * Определяет, есть ли на текущий момент выбранные элементы
   */
  hasCheckedElements() {
    return Object.keys(this.state.checkedElements).length;
  }

  /**
   * @override
   */
  getButtons() {
    // Операции, заданные в статической переменной operations класса-наследника
    const operations = this.constructor.operations || [];
    const entity = this.constructor.entity;
    const buttons = [];
    if (operations.indexOf('CREATE') > 0) {
      buttons.push(
        <ButtonCreate key={buttons.length}
          onClick={this.createElement.bind(this)}
          permissions={[`${entity}.create`]}/>
      );
    }
    if (operations.indexOf('READ') > 0) {
      buttons.push(
        <ButtonRead key={buttons.length}
          onClick={this.showForm.bind(this)}
          disabled={this.checkDisabledRead()}
          permissions={[`${entity}.read`]}/>
      );
    }
    if (operations.indexOf('DELETE') > 0) {
      buttons.push(
        <ButtonDelete key={buttons.length}
          onClick={this.removeCheckedElements.bind(this)}
          disabled={this.checkDisabledDelete()}
          permissions={[`${entity}.delete`]}/>
      );
    }
    return buttons;
  }

}

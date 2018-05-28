import React, { PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import {
  cloneDeep,
  each,
  find,
} from 'lodash';
import ElementsList from './ElementsList.jsx';
import { ButtonCreateNew, ButtonReadNew, ButtonDeleteNew } from './ui/buttons/CRUD';

/**
 * ElementsList с возможностью обрабатывать таблицы с выбором элементов
 * @extends React.Component
 */
export default class CheckableElementsList extends ElementsList {

  static get propTypes() {
    return {
      onListStateChange: PropTypes.func,
      exportable: PropTypes.bool,
      export: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.state, {
      checkedElements: {},
    });
  }

  /**
   * Закрывает форму и обнуляет выбранный элемент
   */
  @autobind
  onFormHide(clearCheckedElements) {
    this.setState({
      showForm: false,
      selectedElement: null,
      checkedElements: clearCheckedElements ? {} : this.state.checkedElements,
    });
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
      multiSelection: true,
    };
  }

  /**
   * @override
   */
  getTableProps() {
    // TODO отображение чекбокса в зависимости от прав
    const tableProps = super.getTableProps();
    const operations = ['delete'];
    const check = this.constructor.operations.includes('CHECK');
    const entity = this.constructor.entity;
    const gp = p => this.context.flux.getStore('session').getPermission(p);

    const noPermission = !check && operations.every(o => !gp(`${entity}.${o}`));
    return noPermission
      ? Object.assign(tableProps, this.getCheckedProps(), { multiSelection: false })
      : Object.assign(tableProps, this.getCheckedProps());
  }

  /**
   * @override
   */
  getButtons(propsButton = {}) {
    // Операции, заданные в статической переменной operations класса-наследника
    const operations = this.constructor.operations || [];
    const entity = this.constructor.entity;
    const buttons = [];

    const {
      BCbuttonName = 'Создать',
      BRbuttonName = 'Просмотреть',
      BDbuttonName = 'Удалить',
    } = propsButton;

    if (operations.indexOf('CREATE') > -1) {
      buttons.push(
        <ButtonCreateNew
          key={'button-create'}
          buttonName={BCbuttonName}
          onClick={this.createElement}
          permission={this.permissions.create}
        />
      );
    }
    if (operations.indexOf('READ') > -1) {
      buttons.push(
        <ButtonReadNew
          key={'button-read'}
          buttonName={BRbuttonName}
          onClick={this.showForm}
          permission={this.permissions.read}
          disabled={this.checkDisabledRead()}
        />
      );
    }
    if (operations.indexOf('DELETE') > -1) {
      buttons.push(
        <ButtonDeleteNew
          key={'button-delete'}
          buttonName={BDbuttonName}
          onClick={this.removeCheckedElements}
          permission={this.permissions.delete}
          disabled={this.checkDisabledDelete()}
        />
      );
    }
    if (this.props.exportable) {
      buttons.push(
        <Button key={buttons.length} bsSize="small" onClick={this.handleExport}><Glyphicon glyph="download-alt" /></Button>
      );
    }
    return buttons;
  }

  /**
   * Определяет, есть ли на текущий момент выбранные элементы
   */
  hasCheckedElements() {
    return Object.keys(this.state.checkedElements).length > 0;
  }

  /**
   * Дополнительная проверка на наличие выбранных элементов
   * @override
   */
  checkDisabledDelete() {
    return super.checkDisabledDelete() && !this.hasCheckedElements();
  }

  /**
   * Удаляет выбранные элементы
   * метод вызывает {@link ElementsList#removeElement} в случае отсутствия выбранных элементов
   */
  @autobind
  async removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') {
      return;
    }

    if (Object.keys(this.state.checkedElements).length !== 0) {
      try {
        await confirmDialog({
          title: 'Внимание!',
          body: 'Вы уверены, что хотите удалить выбранные элементы?',
        });
      } catch (er) {
        return;
      }

      const removeCallback = this.removeElementCallback || (() => {});
      each(this.state.checkedElements, (element) => {
        this.removeElementAction(element[this.selectField], removeCallback);
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
   * Выбирает/снимает выбор со всех элементов
   * @param {object[]} rows - все элементы
   * @param {boolean} state - новое состояние выбора
   */
  @autobind
  checkAll(rows, state) {
    let checkedElements = cloneDeep(this.state.checkedElements);
    checkedElements = state ? rows : {};

    this.setState({ checkedElements }, this.stateChangeCallback.bind(this));
  }

  /**
   * Выбирает/снимает выбор с элемента
   * @param {number} id - id выбранного элемента
   * @param {boolean} state - новое состояние выбора
   */
  @autobind
  checkElement(id, state) {
    const elements = cloneDeep(this.state.checkedElements);
    if (state) {
      elements[parseInt(id, 10)] = find(this.state.elementsList, e => e.id === parseInt(id, 10));
    } else {
      delete elements[id];
    }
    this.setState({ checkedElements: elements }, this.stateChangeCallback.bind(this));
  }

  /**
   * Передает state в другой компонент
   * @todo избавиться от этой функции
   */
  @autobind
  stateChangeCallback() {
    if (typeof this.props.onListStateChange === 'function') {
      this.props.onListStateChange(this.state);
    }
  }

}

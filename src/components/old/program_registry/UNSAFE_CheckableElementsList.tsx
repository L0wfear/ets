import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { cloneDeep, find } from 'lodash';
import UNSAFE_ElementsList from 'components/old/program_registry/UNSAFE_ElementsList';
import {ElementsListState} from 'components/old/program_registry/UNSAFE_ElementsList';
import {
  ButtonCreateNew,
  ButtonReadNew,
  ButtonDeleteNew,
} from 'components/old/ui/buttons/CRUD';

/**
 * ElementsList с возможностью обрабатывать таблицы с выбором элементов
 * @extends React.Component
 */
class CheckableElementsList<P extends Record<string, any>, S extends ElementsListState > extends UNSAFE_ElementsList<P, S> {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.state, {
      checkedElements: {},
    });
  }

  /**
   * Закрывает форму и обнуляет выбранный элемент
   */
  onFormHide = (clearCheckedElements) => {
    this.setState({
      showForm: false,
      selectedElement: null,
      checkedElements: clearCheckedElements ? {} : this.state.checkedElements,
    });
  };

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
    const check = (this.constructor as any).operations.includes('CHECK');
    const entity = (this.constructor as any).entity;

    const noPermission
      = !check
      && operations.every(
        (o) => !this.props.userData.permissionsSet.has(`${entity}.${o}`),
      );
    return noPermission
      ? Object.assign(tableProps, this.getCheckedProps(), {
        multiSelection: false,
      })
      : Object.assign(tableProps, this.getCheckedProps());
  }

  /**
   * @override
   */
  getButtons = (propsButton: any = {}) => {
    // Операции, заданные в статической переменной operations класса-наследника
    const operations = (this.constructor as any).operations || [];
    const buttons = [];

    const {
      BCbuttonName = 'Создать',
      BRbuttonName = 'Просмотреть',
      BDbuttonName = 'Удалить',
    } = propsButton;

    if (operations.indexOf('CREATE') > -1) {
      buttons.push(
        <ButtonCreateNew
          key="button-create"
          buttonName={BCbuttonName}
          onClick={this.createElement}
          permission={this.permissions.create}
        />,
      );
    }
    if (operations.indexOf('READ') > -1) {
      buttons.push(
        <ButtonReadNew
          key="button-read"
          buttonName={BRbuttonName}
          onClick={this.showForm}
          permission={this.permissions.read}
          disabled={this.checkDisabledRead()}
        />,
      );
    }
    if (operations.indexOf('DELETE') > -1) {
      buttons.push(
        <ButtonDeleteNew
          key="button-delete"
          buttonName={BDbuttonName}
          onClick={this.removeCheckedElements}
          permission={this.permissions.delete}
          disabled={this.checkDisabledDelete()}
        />,
      );
    }
    if (this.props.exportable) {
      buttons.push(
        <EtsBootstrap.Button
          key={buttons.length}
          bsSize="small"
          onClick={this.handleExport}>
          <EtsBootstrap.Glyphicon glyph="download-alt" />
        </EtsBootstrap.Button>,
      );
    }
    return buttons;
  };

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
  removeCheckedElements = async () => {
    if (typeof this.removeElementAction !== 'function') {
      return;
    }

    if (Object.keys(this.state.checkedElements).length !== 0) {
      try {
        await global.confirmDialog({
          title: 'Внимание!',
          body: 'Вы уверены, что хотите удалить выбранные элементы?',
        });
      } catch (er) {
        return;
      }

      try {
        await Promise.all(
          Object.values(this.state.checkedElements).map((element) => {
            return this.removeElementAction(
              element[this.selectField],
              () => {
                //
              },
            );
          }),
        );
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
      if (this.removeElementCallback) {
        this.removeElementCallback();
      }
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    } else {
      this.removeElement();
    }
  };

  /**
   * Выбирает/снимает выбор со всех элементов
   * @param {object[]} rows - все элементы
   * @param {boolean} state - новое состояние выбора
   */
  checkAll = (rows, state) => {
    let checkedElements = cloneDeep(this.state.checkedElements);
    checkedElements = state ? rows : {};

    this.setState({ checkedElements }, this.stateChangeCallback.bind(this));
  };

  /**
   * Выбирает/снимает выбор с элемента
   * @param {number} id - id выбранного элемента
   * @param {boolean} state - новое состояние выбора
   */
  checkElement = (id, state) => {
    const elements = cloneDeep(this.state.checkedElements);
    if (state) {
      const checkedElement = find(
        this.state.elementsList,
        (e) => e[this.selectField] === parseInt(id, 10),
      );
      if (checkedElement) {
        elements[parseInt(id, 10)] = checkedElement;
      }
    } else {
      delete elements[id];
    }
    this.setState(
      { checkedElements: elements },
      this.stateChangeCallback.bind(this),
    );
  };

  /**
   * Передает state в другой компонент
   * @todo избавиться от этой функции
   */
  stateChangeCallback = () => {
    if (typeof this.props.onListStateChange === 'function') {
      this.props.onListStateChange(this.state);
    }
  };
}

export default CheckableElementsList;

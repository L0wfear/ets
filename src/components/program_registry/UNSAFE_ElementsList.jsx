import * as React from 'react';
import * as PropTypes from 'prop-types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import * as queryString from 'query-string';

import Preloader from 'components/ui/new/preloader/Preloader';
import { FluxContext } from 'utils/decorators';

import { EtsPageWrap } from 'global-styled/global-styled';

import {
  ButtonCreateNew,
  ButtonReadNew,
  ButtonDeleteNew,
} from 'components/ui/buttons/CRUD';

/**
 * Базовый класс для отображения таблиц и привязанных к ним форм (модальных окон)
 * используется для наследования
 * @extends React.Component
 */

@FluxContext
class ElementsList extends React.Component {
  static get propTypes() {
    return {
      location: PropTypes.object,
      exportable: PropTypes.bool,
      export: PropTypes.func,
      userData: PropTypes.any,
    };
  }

  /**
   * Создает компонент
   */
  constructor(props) {
    super(props);

    this.selectField = this.constructor.selectField || 'id';
    this.mainListName = this.constructor.listName || undefined;
    this.entity = this.constructor.entity;
    this.tableMeta = this.constructor.tableMeta || {};
    this.preventUrlFilters = false;
    this.permissions = this.constructor.permissions || {};
    this.clicks = 0;

    this.state = {
      mainListName: this.mainListName,
      elementsList: [],
      showForm: false,
      selectedElement: null,
      readPermission: false,
      exportFetching: false,
    };
  }

  // Удалить
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      elementsList: nextProps[prevState.mainListName],
    };
  }

  componentDidMount() {
    if (!this.keyPressDisabled) {
      this.node.setAttribute('tabindex', 1);
      this.node.onkeydown = this.onKeyPress.bind(this);
    }

    const readPermission
      = this.props.userData.permissionsSet.has(`${this.entity}.read`) > -1;
    this.setState({ readPermission });

    this.init();
  }

  /**
   * Дополнительная инициализация после componentDidMount
   * может быть переопределена в дочерних классах
   */
  init() {}

  /**
   * Выбирает элемент
   * в случае вызова метода чаще, чем раз в 300мсек, открывает форму с выбранным
   * элементом
   */
  selectElement = ({ props: { data: selectedElement }, props }) => {
    if (props.fromKey) {
      this.setState({ selectedElement });
      return;
    }

    if (selectedElement[this.selectField]) {
      this.setState({ selectedElement });
    }
  };

  onRowClick = ({ props: { data } }) => {
    if (data[this.selectField]) {
      this.setState({
        selectedElement: data,
      });
    }
  };

  onRowDoubleClick = ({ props: { data } }) => {
    if (this.state.readPermission && data[this.selectField]) {
      this.setState({
        selectedElement: data,
        showForm: true,
      });
    }
  };

  setNewSelectedElement = (selectedElement) =>
    Promise.resolve(this.setState({ showForm: false })).then(() => {
      this.setState({
        showForm: true,
        selectedElement,
      });
    });

  /**
   * Обнуляет выбранный элемент и открывает форму для создания нового
   */
  createElement = () => {
    this.setState({
      showForm: true,
      selectedElement: null,
    });
  };

  /**
   * Открывает форму
   */
  showForm = () => {
    this.setState({
      showForm: true,
    });
  };

  /**
   * Закрывает форму и обнуляет выбранный элемент
   */
  onFormHide = () => {
    this.setState({
      showForm: false,
      selectedElement: null,
    });
  };

  formCallback = () => {
    this.onFormHide();
  };

  /**
   * Вызывает диалог подтверждения удаления выбранного элемента и в случае подтверждения удаляет выбранный элемент
   * метод не будет исполняться в случае отсутствия выбранного элемента и не
   * определенной в классе-наследнике функции this.removeElementAction
   * this.removeElementCallback переопределяет операцию по умолчанию ([serviceName].get) после удаления
   */
  removeElement = () => {
    if (
      typeof this.removeElementAction !== 'function'
      || this.state.selectedElement === null
    ) {
      return Promise.reject();
    }

    const removeCallback = this.removeElementCallback || (() => {});

    confirmDialog({
      title: 'Внимание!',
      body: 'Вы уверены, что хотите удалить выбранный элемент?',
    })
      .then(() => {
        const query = this.removeElementAction(
          this.state.selectedElement[this.selectField],
          removeCallback,
        );

        this.setState({ selectedElement: null });
        return query;
      })
      .catch(() => {});
  };

  onKeyPress(e) {
    const { activeElement } = document;

    if (activeElement) {
      const activeTabIndex = activeElement.getAttribute('tabIndex');
      const appropriateTabIndex
        = activeTabIndex === '1' || activeTabIndex === '2';
      if (!appropriateTabIndex) {
        return;
      }

      if (
        e.code === 'Enter'
        && this.state.selectedElement !== null
        && this.state.readPermission
      ) {
        this.showForm();
      }

      if (e.code === 'Backspace' && this.state.selectedElement !== null) {
        e.preventDefault();
      }
    }
  }

  checkDisabledDelete() {
    return this.state.selectedElement === null || this.state.showForm;
  }

  checkDisabledRead() {
    return this.state.selectedElement === null || this.state.showForm;
  }

  /**
   * Определяет и возвращает массив кнопок для CRUD операций
   * @return {Component[]} Buttons - массив кнопок
   */
  getButtons(propsButton = {}) {
    // Операции, заданные в статической переменной operations класса-наследника
    const operations = this.constructor.operations || [];
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
          disabled={this.state.showForm}
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
          onClick={this.removeElement}
          permission={this.permissions.delete}
          disabled={this.checkDisabledDelete()}
        />,
      );
    }
    if (this.props.exportable) {
      const isEmptyList
        = this.props[this.mainListName]
        && this.props[this.mainListName].length === 0;
      buttons.push(
        <EtsBootstrap.Button
          id="regestry-download-alt"
          disabled={isEmptyList || this.state.showForm}
          key={buttons.length}
          bsSize="small"
          onClick={this.handleExport}>
          <EtsBootstrap.Glyphicon glyph="download-alt" />
        </EtsBootstrap.Button>,
      );
    }
    return buttons;
  }

  processExport = async (exportPayload = this.exportPayload) => {
    try {
      this.setState({ exportFetching: true });
      await this.props.export(exportPayload, this.exportUseRouteParams);
      this.setState({ exportFetching: false });
    } catch (error) {
      this.setState({ exportFetching: false });
    }
  };

  handleExport = () => {
    if (typeof this.export === 'function') {
      this.export();
      return;
    }

    this.processExport();
  };

  /**
   * Получение props, связанных с выбором элементов
   * @return {object} selectableTableProps - свойства
   */
  getSelectedProps() {
    return {
      onRowSelected: this.selectElement,
      selected: this.state.selectedElement,
      selectField: this.selectField,
      uniqName: this.selectField,
      onRowClick: this.onRowClick,
      onRowDoubleClick: this.onRowDoubleClick,
    };
  }

  /**
   * Получение props, которые всегда передаются в таблицу
   * @return {object} basicProps - свойства, передающиеся в таблицу всегда
   */
  getBasicProps() {
    const listName = this.constructor.listName;
    let basicProps = {
      data: this.props[listName],
      entity: this.entity,
    };
    const { location: { search = '' } = {} } = this.props;
    const searchObject = queryString.parse(search);

    if (this.props.location && search && !this.preventUrlFilters) {
      basicProps = {
        ...basicProps,
        filterValues: searchObject,
      };
    }
    return basicProps;
  }

  /**
   * Метод для переопределения в дочерних компонентах
   * используется для передачи дополнительных свойств в компонент таблицы
   */
  getAdditionalProps() {
    return {};
  }

  /**
   * Получение всех props, которые будут переданы в компонент таблицы
   * @return {object} tableProps - свойства
   */
  getTableProps() {
    return Object.assign(
      {},
      this.getBasicProps(),
      this.getSelectedProps(),
      this.getAdditionalProps(),
    );
  }

  /**
   * Возвращает компонент таблицы с переданными туда props
   * возвращает null, если класс-наследник не использует tableComponent
   * @return {Component} TableComponent - компонент таблицы
   */
  getTable() {
    const TableComponent = this.constructor.tableComponent;

    if (!TableComponent) {
      return <div />;
    }

    return (
      <TableComponent
        {...this.getTableProps()}
        {...this.props}
        flux={this.context.flux}>
        {this.getButtons()}
      </TableComponent>
    );
  }

  getAdditionalFormProps() {
    return {};
  }

  /**
   * Возвращает компонент формы с переданными туда props
   * возвращает null, если класс-наследник не испольует formComponent
   * @return {Component} FormComponent - компонент формы
   */
  getForms() {
    const FormComponent = this.constructor.formComponent;
    const forms = [];

    if (!FormComponent) {
      return forms;
    }

    forms.push(
      <FormComponent
        key={forms.length}
        onFormHide={this.onFormHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        setNewSelectedElement={this.setNewSelectedElement}
        entity={this.entity}
        selectField={this.selectField}
        onCallback={this.formCallback}
        meta={this.constructor.formMeta}
        renderers={this.constructor.formRenderers}
        permissions={[`${this.entity}.read`]}
        flux={this.context.flux}
        {...this.getAdditionalFormProps()}
        {...this.props}
      />,
    );

    return forms;
  }

  additionalRender() {
    return '';
  }

  setNode = (node) => {
    this.node = node;
  };

  /**
   * React render
   */
  render() {
    const table = this.getTable();
    const forms = this.getForms();
    const additionalRender = this.additionalRender();
    const preloader = this.state.exportFetching && (
      <Preloader typePreloader="mainpage" />
    );

    return (
      <EtsPageWrap ref={this.setNode}>
        {table}
        {additionalRender}
        {forms}
        {preloader}
      </EtsPageWrap>
    );
  }
}

export default ElementsList;

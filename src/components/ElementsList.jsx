import React, { PropTypes } from 'react';
import find from 'lodash/find';
import { autobind } from 'core-decorators';
import { Button, Glyphicon } from 'react-bootstrap';
import * as queryString from 'query-string';

import Preloader from 'components/ui/Preloader';
import { FluxContext } from 'utils/decorators';
import { ButtonCreate, ButtonRead, ButtonDelete } from './ui/buttons/CRUD';

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
    };
  }

  /**
   * Создает компонент
   */
  constructor(props) {
    super(props);

    this.state = {
      elementsList: [],
      showForm: false,
      selectedElement: null,
      readPermission: false,
      exportFetching: false,
    };

    this.selectField = this.constructor.selectField || 'id';
    this.mainListName = this.constructor.listName || undefined;
    this.entity = this.constructor.entity;
    this.tableMeta = this.constructor.tableMeta || {};
    this.preventUrlFilters = false;

    this.clicks = 0;
  }

  componentWillMount() {
    const readPermission = this.context.flux.getStore('session').state.userPermissions.indexOf(`${this.entity}.read`) > -1;
    this.setState({ readPermission });
  }

  componentDidMount() {
    if (!this.keyPressDisabled) {
      this.node.setAttribute('tabindex', 1);
      this.node.onkeydown = this.onKeyPress.bind(this);
    }
    this.init();
  }

  componentWillReceiveProps(props) {
    const elementsList = props[this.mainListName] || [];
    const schemaProperties = this.constructor.schema ? this.constructor.schema.properties : null;
    if (schemaProperties) {
      elementsList.forEach((el) => {
        Object.keys(el).forEach((k) => {
          const field = schemaProperties.find(p => (p.key === k) && p.float);
          if (field && el[k] != null && el[k] !== '') el[k] = parseFloat(el[k]).toFixed(field.float);
        });
      });
    }
    this.setState({ elementsList });
    this.inheritedComponentWillReceiveProps(props);
  }

  /**
   * Дополнительная инициализация после componentDidMount
   * может быть переопределена в дочерних классах
   */
  init() {}

  /**
   * Дополнительный ComponentWillReceiveProps унаследованных компонентов
   */
  inheritedComponentWillReceiveProps() {}

  /**
   * Выбирает элемент
   * в случае вызова метода чаще, чем раз в 300мсек, открывает форму с выбранным
   * элементом
   */
  @autobind
  selectElement({ props }) {
    const DOUBLECLICK_TIMEOUT = 300;
    function onDoubleClick() {
      return this.setState({
        showForm: true,
      });
    }

    // TODO реализовать вызов ошибки в случае пустого айдишника
    const id = props && props.data ? props.data[this.selectField] : null;

    if (props.fromKey) {
      const selectedElement = find(this.state.elementsList, el => el.id ? el.id === id : el[this.selectField] === id);
      if (selectedElement) {
        this.setState({ selectedElement });
      }
      return;
    }

    this.clicks += 1;

    if (this.clicks === 1) {
      const selectedElement = find(this.state.elementsList,
        el => el.id ? el.id === id : el[this.selectField] === id
      );
      this.setState({ selectedElement });
      setTimeout(() => {
        // В случае если за DOUBLECLICK_TIMEOUT (мс) кликнули по одному и тому же элементу больше 1 раза
        if (this.clicks !== 1) {
          if (this.state.selectedElement && id === this.state.selectedElement[this.selectField] && this.state.readPermission) {
            onDoubleClick.call(this);
          }
        }
        this.clicks = 0;
      }, DOUBLECLICK_TIMEOUT);
    }
  }

  setNewSelectedElement = (selectedElement) => {
    this.setState({
      showForm: true,
      selectedElement,
    });
  }

  /**
   * Обнуляет выбранный элемент и открывает форму для создания нового
   */
  @autobind
  createElement() {
    this.setState({
      showForm: true,
      selectedElement: null,
    });
  }

  /**
   * Открывает форму
   */
  @autobind
  showForm() {
    this.setState({
      showForm: true,
    });
  }

  /**
   * Закрывает форму и обнуляет выбранный элемент
   */
  @autobind
  onFormHide() {
    this.setState({
      showForm: false,
      selectedElement: null,
    });
  }

  @autobind
  formCallback() {
    this.onFormHide();
  }

  /**
   * Вызывает диалог подтверждения удаления выбранного элемента и в случае подтверждения удаляет выбранный элемент
   * метод не будет исполняться в случае отсутствия выбранного элемента и не
   * определенной в классе-наследнике функции this.removeElementAction
   * this.removeElementCallback переопределяет операцию по умолчанию ([serviceName].get) после удаления
   */
  @autobind
  removeElement() {
    if (typeof this.removeElementAction !== 'function' || this.state.selectedElement === null) {
      return;
    }

    const removeCallback = this.removeElementCallback || (() => {});

    confirmDialog({
      title: 'Внимание',
      body: 'Вы уверены, что хотите удалить выбранный элемент?',
    })
    .then(() => {
      this.removeElementAction(this.state.selectedElement[this.selectField], removeCallback);
      this.setState({ selectedElement: null });
    })
    .catch(() => {});
  }

  onKeyPress(e) {
    const activeTabIndex = document.activeElement.getAttribute('tabIndex');
    const appropriateTabIndex = activeTabIndex === '1' || activeTabIndex === '2';
    if (!appropriateTabIndex) {
      return;
    }

    if (e.code === 'Enter' && this.state.selectedElement !== null && this.state.readPermission) {
      this.showForm();
    }

    if (e.code === 'Backspace' && this.state.selectedElement !== null) {
      e.preventDefault();
      if (typeof this.removeDisabled === 'function') {
        if (!this.removeDisabled()) {
          this.removeElement();
        }
      } else {
        this.removeElement();
      }
    }
  }

  checkDisabledDelete() {
    return this.state.selectedElement === null;
  }

  checkDisabledRead() {
    return this.state.selectedElement === null;
  }
  async processExport(exportPayload = this.exportPayload) {
    try {
      this.setState({ exportFetching: true });
      await this.props.export(exportPayload, this.exportUseRouteParams);
      this.setState({ exportFetching: false });
    } catch (error) {
      this.setState({ exportFetching: false });
    }
  }
  handleExport = () => {
    if (typeof this.export === 'function') {
      this.export();
      return;
    }

    this.processExport();
  }
  /**
   * Определяет и возвращает массив кнопок для CRUD операций
   * @return {Component[]} Buttons - массив кнопок
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
        <ButtonCreate
          buttonName={BCbuttonName}
          key={buttons.length}
          onClick={this.createElement}
          permissions={[`${entity}.create`]}
        />
      );
    }
    if (operations.indexOf('READ') > -1) {
      buttons.push(
        <ButtonRead
          buttonName={BRbuttonName}
          key={buttons.length}
          onClick={this.showForm}
          disabled={this.checkDisabledRead()}
          permissions={[`${entity}.read`]}
        />
      );
    }
    if (operations.indexOf('DELETE') > -1) {
      buttons.push(
        <ButtonDelete
          buttonName={BDbuttonName}
          key={buttons.length}
          onClick={this.removeElement}
          disabled={this.checkDisabledDelete()}
          permissions={[`${entity}.delete`]}
        />
      );
    }
    if (this.props.exportable) {
      const isEmptyList = this.props[this.mainListName] && this.props[this.mainListName].length === 0;
      buttons.push(
        <Button
          disabled={isEmptyList}
          key={buttons.length}
          bsSize="small"
          onClick={this.handleExport}
        >
          <Glyphicon glyph="download-alt" />
        </Button>
      );
    }
    return buttons;
  }

  /**
   * Получение props, связанных с выбором элементов
   * @return {object} selectableTableProps - свойства
   */
  getSelectedProps() {
    return {
      onRowSelected: this.selectElement,
      selected: this.state.selectedElement,
      selectField: this.selectField,
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
    };
    const { location: { search } } = this.props;
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
    return Object.assign({},
      this.getBasicProps(),
      this.getSelectedProps(),
      this.getAdditionalProps()
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
        flux={this.context.flux}
      >
        {this.getButtons()}
      </TableComponent>
    );
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
        onCallback={this.formCallback}
        meta={this.constructor.formMeta}
        renderers={this.constructor.formRenderers}
        permissions={[`${this.entity}.read`]}
        {...this.props}
      />
    );

    return forms;
  }

  additionalRender() {
    return '';
  }

  /**
   * React render
   */
  render() {
    const table = this.getTable();
    const forms = this.getForms();
    const additionalRender = this.additionalRender();
    const preloader = this.state.exportFetching && <Preloader type="mainpage"/>;

    return (
      <div className="ets-page-wrap" ref={node => (this.node = node)}>
        {table}
        {additionalRender}
        {forms}
        {preloader}
      </div>
    );
  }

}

export default ElementsList;

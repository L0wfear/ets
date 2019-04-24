import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { connectToStores, staticProps } from 'utils/decorators';
import UNSAFE_ElementsList from 'components/program_registry/UNSAFE_ElementsList';
import ModalBody from 'components/ui/Modal';
import {
  ButtonCreate,
  ButtonRead,
  ButtonDelete,
} from 'components/ui/buttons/CRUD';

import PercentModalTable from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalTable';
import PercentModalFormWrap from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalFormWrap';
import permissions from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['repair'])
@staticProps({
  entity: 'repair_program_version',
  permissions,
  listName: 'dataAboutObjectbyIdList',
  tableComponent: PercentModalTable,
  formComponent: PercentModalFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'DELETE'],
})
class PercentModalList extends UNSAFE_ElementsList {
  constructor(props) {
    super(props);
    this.keyPressDisabled = true;
  }

  removeElementAction = (id) =>
    this.context.flux
      .getActions('repair')
      .removePercent(id)
      .then(this.checkMinVals);

  init() {
    this.checkMinVals();
  }

  checkMinVals = () => {
    const { object_id: id } = this.props;
    this.context.flux
      .getActions('repair')
      .getDataAboutObjectById(id)
      .then((ans) => {
        const { result: { rows = [] } = {} } = ans;
        const { other = {} } = this.state;
        other.minPercent = Math.max(...rows.map(({ percent }) => percent));
        other.minReviewedAt = isEmpty(rows)
          ? moment().year(1900)
          : moment.max(rows.map(({ reviewed_at }) => moment(reviewed_at)));

        this.setState({ other });

        return ans;
      });
  };

  /**
   * @override
   */
  createElement = () => {
    const { object_id } = this.props;

    this.setState({
      showForm: true,
      selectedElement: {
        object_id,
        reviewed_at: new Date(),
      },
    });
  };

  /**
   * @override
   */
  getButtons(propsButton = {}) {
    const { isPermittedByStatus } = this.props;

    // Операции, заданные в статической переменной operations класса-наследника
    const entity = this.constructor.entity;
    const buttons = [];

    const {
      BCbuttonName = 'Создать',
      BRbuttonName = 'Просмотреть',
      BDbuttonName = 'Удалить',
    } = propsButton;

    buttons.push(
      <ButtonCreate
        buttonName={BCbuttonName}
        key={buttons.length}
        onClick={this.createElement}
        permissions={[`${entity}.create`]}
        disabled={!isPermittedByStatus}
      />,
    );
    buttons.push(
      <ButtonRead
        buttonName={BRbuttonName}
        key={buttons.length}
        onClick={this.showForm}
        disabled={this.checkDisabledRead() || !isPermittedByStatus}
        permissions={[`${entity}.read`]}
      />,
    );
    buttons.push(
      <ButtonDelete
        buttonName={BDbuttonName}
        key={buttons.length}
        onClick={this.removeElement}
        disabled={this.checkDisabledDelete() || !isPermittedByStatus}
        permissions={[`${entity}.delete`]}
      />,
    );

    return buttons;
  }

  /**
   * @override
   */
  checkDisabledDelete() {
    if (!super.checkDisabledDelete()) {
      const {
        selectedElement: { created_at },
      } = this.state;

      return moment().diff(created_at, 'days') > 0;
    }
    return true;
  }
  /**
   * @override
   */
  getForms() {
    const FormComponent = this.constructor.formComponent;
    const forms = [];

    if (!FormComponent) {
      return forms;
    }
    const { other } = this.state;

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
        other={other}
        checkMinVals={this.checkMinVals}
        {...this.props}
      />,
    );

    return forms;
  }

  render() {
    return (
      <Modal
        id="modal-percent-list"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="lg"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{'Проставление процента выполнения работ'}</Modal.Title>
        </Modal.Header>
        {super.render()}
        <ModalBody />
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(PercentModalList);

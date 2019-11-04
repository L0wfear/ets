import * as React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as moment from 'moment';

import { connectToStores, staticProps } from 'utils/decorators';
import UNSAFE_ElementsList from 'components/old/program_registry/UNSAFE_ElementsList';
import ModalBody from 'components/old/ui/Modal';
import {
  ButtonCreateNew,
  ButtonReadNew,
  ButtonDeleteNew,
} from 'components/old/ui/buttons/CRUD';

import PercentModalTable from 'components/old/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalTable';
import PercentModalFormWrap from 'components/old/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalFormWrap';
import permissions from 'components/old/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/config-data/permissions';

import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

type Props = {
  updateObjectData: any;
  object_id: any;
  isPermittedPercentByStatus: any;

  onHide: any;
};
type State = any;

@connectToStores(['repair'])
@staticProps({
  entity: 'repair_program_version',
  permissions,
  listName: 'dataAboutObjectbyIdList',
  tableComponent: PercentModalTable,
  formComponent: PercentModalFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'DELETE'],
})
class PercentModalList extends UNSAFE_ElementsList<Props, State> {
  constructor(props) {
    super(props);
    this.keyPressDisabled = true;
  }

  removeElementAction = (id) =>
    this.context.flux
      .getActions('repair')
      .removePercent(id)
      .then(() => {
        this.props.updateObjectData();
        this.checkMinVals();
      });

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
  getButtons(propsButton: any = {}) {
    const { isPermittedPercentByStatus } = this.props;

    // Операции, заданные в статической переменной operations класса-наследника
    const entity = (this.constructor as any).entity;
    const buttons = [];

    const {
      BCbuttonName = 'Создать',
      BRbuttonName = 'Просмотреть',
      BDbuttonName = 'Удалить',
    } = propsButton;

    buttons.push(
      <ButtonCreateNew
        buttonName={BCbuttonName}
        key={buttons.length}
        onClick={this.createElement}
        permission={`${entity}.create`}
        disabled={!isPermittedPercentByStatus}
      />,
    );
    buttons.push(
      <ButtonReadNew
        buttonName={BRbuttonName}
        key={buttons.length}
        onClick={this.showForm}
        disabled={this.checkDisabledRead() || !isPermittedPercentByStatus}
        permission={`${entity}.read`}
      />,
    );
    buttons.push(
      <ButtonDeleteNew
        buttonName={BDbuttonName}
        key={buttons.length}
        onClick={this.removeElement}
        disabled={this.checkDisabledDelete() || !isPermittedPercentByStatus}
        permission={`${entity}.delete`}
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
    const FormComponent = (this.constructor as any).formComponent;
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
        meta={(this.constructor as any).formMeta}
        renderers={(this.constructor as any).formRenderers}
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
      <EtsBootstrap.ModalContainer
        id="modal-percent-list"
        show
        onHide={this.props.onHide}
        bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>
            {'Проставление процента выполнения работ'}
          </EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody>{super.render()}</ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={this.props.onHide}>
            Закрыть
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(PercentModalList);

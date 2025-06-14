import * as React from 'react';

import { connectToStores, staticProps } from 'utils/decorators';
import UNSAFE_CheckableElementsList from 'components/old/program_registry/UNSAFE_CheckableElementsList';
import {
  ButtonCreateNew,
  ButtonReadNew,
  ButtonDeleteNew,
} from 'components/old/ui/buttons/CRUD';

import ProgramObjectTable from 'components/old/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectTable';
import ProgramObjectFormWrap from 'components/old/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormWrap';
import permissions from 'components/old/program_registry/UpdateFrom/inside_components/program_object/config-data/permissions';
import { connect } from 'react-redux';
import {
  getSessionState,
  getSomeUniqState,
} from 'redux-main/reducers/selectors';
import { actionGetAndSetInStoreTechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_actions';
import { ReduxState } from 'redux-main/@types/state';

const bodyConfirmDialogs = {
  remove(countCheckedElement) {
    return `Вы уверены, что хотите удалить выбранн${
      countCheckedElement === 1 ? 'ый' : 'ые'
    } объект${countCheckedElement === 1 ? '' : 'ы'}?`;
  },
};

const notifyTexts = {
  remove(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ый' : 'ые'} объект${
      countCheckedElement === 1 ? '' : 'ы'
    } удал${countCheckedElement === 1 ? 'ен' : 'ены'}`;
  },
};

type Props = any;
type State = any;

@connectToStores(['repair'])
@staticProps({
  entity: 'repair_program_version',
  permissions,
  listName: 'objectsList',
  tableComponent: ProgramObjectTable,
  formComponent: ProgramObjectFormWrap,
  operations: [],
})
class ProgramRemarkList extends UNSAFE_CheckableElementsList<Props, State> {
  updateAction: any;

  constructor(props, context) {
    super(props);
    const { program_version_id } = props;

    this.updateAction = context.flux
      .getActions('repair')
      .getRepairListByType.bind(this, 'objects', { program_version_id });
  }

  componentDidUpdate(prevProps) {
    const { program_version_id: new_version } = this.props;
    const { program_version_id: old_version } = prevProps;

    if (new_version !== old_version) {
      this.init(false);
    }
  }

  removeElementAction = (id) =>
    this.context.flux.getActions('repair').removeProgramObject(id, {
      program_version_id: this.props.program_version_id,
    });

  removeCheckedElements = async () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.remove,
      callbackForCheckedElement: this.removeElementAction,
      callBackForOneElement: this.removeElement,
      notifyText: notifyTexts.remove,
    });
  };
  /**
   * @override
   */
  removeElement = () =>
    global.confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.remove(1),
    })
      .then(() =>
        this.removeElementAction(
          this.state.selectedElement[this.selectField],
        ).then(() => {
          this.setState({ selectedElement: null });
          global.NOTIFICATION_SYSTEM.notify(notifyTexts.remove(1));
        }),
      )
      .catch(() => {
        //
      });

  defActionFunc = ({
    bodyConfirmDialog,
    callbackForCheckedElement,
    callBackForOneElement,
    notifyText,
  }) => {
    const { checkedElements = {} } = this.state;

    const checkElList = Object.values(checkedElements);
    const countCheckEl = checkElList.length;

    if (countCheckEl !== 0) {
      global.confirmDialog({
        title: 'Внимание',
        body: bodyConfirmDialog(countCheckEl),
      })
        .then(() => {
          Promise.all(
            checkElList.map((el) =>
              callbackForCheckedElement(el[this.selectField]),
            ),
          ).then(() => {
            this.updateAction();
            global.NOTIFICATION_SYSTEM.notify(notifyText(countCheckEl));
          });

          this.setState({
            checkedElements: {},
            selectedElement: null,
          });
        })
        .catch(() => {
          //
        });
    } else {
      callBackForOneElement().then(() => this.updateAction());
    }
  };

  createDT = () => {
    const { program_version_id, contract_number, contractor_id } = this.props;

    this.setState({
      ...this.state,
      showForm: true,
      selectedElement: {
        type_slug: 'dt',
        objectsType: 'simple_dt',
        program_version_id,
        contract_number,
        contractor_id,
        object_list: [],
        draw_object_list: [],
        elements: [],
        plan_shape_json: {
          manual: false,
        },
      },
    });
  };
  createODH = () => {
    const {
      program_version_id,
      contract_number,
      contractor_id,
      repair_type_name,
    } = this.props;

    this.setState({
      ...this.state,
      showForm: true,
      selectedElement: {
        type_slug: 'odh',
        objectsType: 'mixed',
        program_version_id,
        contract_number,
        contractor_id,
        elements: [],
        plan_shape_json: { manual: false },
        repair_type_name,
      },
    });
  };

  checkDisabledDelete() {
    const { selectedElement, checkedElements } = this.state;

    let checkedItems = {};

    if (selectedElement) {
      checkedItems[selectedElement[this.selectField]] = selectedElement;
    } else {
      checkedItems = checkedElements || {};
    }

    const checkedItemsAsArray: Array<any> = Object.values(checkedItems);

    return (
      !checkedItemsAsArray.length
      || checkedItemsAsArray.some(
        (objectData) => objectData.fact_date_start || objectData.fact_date_end,
      )
    );
  }

  /**
   * @override
   */
  getButtons = () => {
    const entity = (this.constructor as any).entity;
    const {
      repair_type_name,
      program_version_status,
      technicalOperationObjectsList = [],
      object_type_id,
      isPermittedByStatus,
    } = this.props;

    const slugTypeObjectPr = (
      technicalOperationObjectsList.find(({ id }) => id === object_type_id)
      || {}
    ).slug;

    const buttons = [
      <ButtonDeleteNew
        buttonName={'Удалить'}
        key={0}
        onClick={this.removeCheckedElements}
        disabled={
          this.checkDisabledDelete()
          || program_version_status === 'accepted'
          || !isPermittedByStatus
        }
        permission={`${entity}.delete`}
      />,
      <ButtonReadNew
        buttonName={'Посмотреть'}
        key={1}
        onClick={this.showForm}
        disabled={this.checkDisabledRead()}
        permission={`${entity}.update`}
      />,
    ];

    if (slugTypeObjectPr === 'dt') {
      buttons.push(
        <ButtonCreateNew
          buttonName={'Добавить ДТ'}
          key={2}
          onClick={this.createDT}
          permission={`${entity}.update`}
          disabled={
            program_version_status === 'accepted'
            || repair_type_name !== 'Капитальный'
            || !isPermittedByStatus
          }
        />,
      );
    }
    if (slugTypeObjectPr === 'odh') {
      buttons.push(
        <ButtonCreateNew
          buttonName={'Добавить ОДХ'}
          key={3}
          onClick={this.createODH}
          disabled={
            program_version_status === 'accepted' || !isPermittedByStatus
          }
          permission={`${entity}.false`}
        />,
      );
    }

    return buttons;
  };

  init(needVersionUpdate) {
    this.props.updateObjectData(needVersionUpdate, { percentUpdate: true });
    this.props.dispatch(
      actionGetAndSetInStoreTechnicalOperationObjects(
        {},
        {
          page: 'mainpage',
        },
      ),
    );
  }

  getAdditionalProps = () => ({
    displayTable: true,
  });

  changeVersionWithObject = ({ program_version_id, object_id }) => {
    this.props
      .changeVersion(program_version_id)
      .then(() => this.props.updateObjectData(false))
      .then(() =>
        this.setNewSelectedElement(
          this.props.objectsList.find(({ id }) => id === object_id),
        ),
      );
  };

  /**
   * @override
   */
  getForms() {
    const FormComponent = (this.constructor as any).formComponent;
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
        meta={(this.constructor as any).formMeta}
        renderers={(this.constructor as any).formRenderers}
        permissions={[`${this.entity}.read`]}
        changeVersionWithObject={this.changeVersionWithObject}
        {...this.props}
      />,
    );

    return forms;
  }
}

export default connect<any, any, any, ReduxState>(
  (state: ReduxState) => ({
    userData: getSessionState(state).userData,
    technicalOperationObjectsList: getSomeUniqState(state)
      .technicalOperationObjectsList,
  }),
)(ProgramRemarkList);

import * as React from 'react';
import { connect } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import UNSAFE_CheckableElementsList from 'components/old/program_registry/UNSAFE_CheckableElementsList';
import {
  ButtonCreateNew,
  ButtonDeleteNew,
} from 'components/old/ui/buttons/CRUD';

import ProgramRemarkTable from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/ProgramRemarkTable';
import ProgramRemarkFormWrap from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/ProgramRemarkFormWrap';
import permissions from 'components/old/program_registry/UpdateFrom/inside_components/program_remark/config-data/permissions';

import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

export const ButtonChangeStatus = ({
  permission,
  onClick,
  disabled,
  buttonName,
}) => (
  <EtsBootstrap.Button
    bsSize="small"
    onClick={onClick}
    permissions={permission}
    disabled={disabled}>
    {buttonName}
  </EtsBootstrap.Button>
);

const bodyConfirmDialogs = {
  remove(countCheckedElement) {
    return `Вы уверены, что хотите удалить выбранн${
      countCheckedElement === 1 ? 'ое' : 'ые'
    } замечани${countCheckedElement === 1 ? 'е' : 'я'}?`;
  },
  reject(countCheckedElement) {
    return `Вы уверены, что хотите отклонить выбранн${
      countCheckedElement === 1 ? 'ое' : 'ые'
    } замечани${countCheckedElement === 1 ? 'е' : 'я'}?`;
  },
  fix(countCheckedElement) {
    return `Вы уверены, что хотите перевести выбранн${
      countCheckedElement === 1 ? 'ое' : 'ые'
    } замечани${countCheckedElement === 1 ? 'е' : 'я'} в статус "Исправлено"?`;
  },
};

const notifyTexts = {
  remove(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${
      countCheckedElement === 1 ? 'е' : 'я'
    } удал${countCheckedElement === 1 ? 'ено' : 'ены'}`;
  },
  reject(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${
      countCheckedElement === 1 ? 'е' : 'я'
    } отклон${countCheckedElement === 1 ? 'ено' : 'ены'}`;
  },
  fix(countCheckedElement) {
    return `У выбранн${countCheckedElement === 1 ? 'ого' : 'ых'} замечани${
      countCheckedElement === 1 ? 'я' : 'ий'
    } изменён статус на "Исправлено"`;
  },
};

type Props = {
  program_version_id: any;
  program_version_status: any;
  programRemarkRegistryList: Array<any>;
};
type State = any;

@connectToStores(['repair'])
@staticProps({
  entity: 'repair_program_version',
  permissions,
  listName: 'programRemarkRegistryList',
  formComponent: ProgramRemarkFormWrap,
  tableComponent: ProgramRemarkTable,
  operations: [],
})
class ProgramRemarkList extends UNSAFE_CheckableElementsList<Props, State> {
  updateAction: any;
  rejectRemarksAction: any;
  fixRemarksAction: any;

  constructor(props, context) {
    super(props);
    const { program_version_id } = props;

    this.updateAction = context.flux
      .getActions('repair')
      .getRepairListByType.bind(this, 'programRemarkRegistry', {
        program_version_id,
      });
    this.rejectRemarksAction = context.flux.getActions('repair').rejectRemarks;
    this.fixRemarksAction = context.flux.getActions('repair').fixRemarks;
  }

  removeElementAction = (id) => {
    const { program_version_id } = this.props;

    return this.context.flux
      .getActions('repair')
      .removeProgramRemark(id, { program_version_id });
  };

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
  removeElement = async () => {
    return global.confirmDialog({
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
  };

  rejectRemarksCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.reject,
      callbackForCheckedElement: this.rejectRemarksAction,
      callBackForOneElement: this.rejectRemarksElement,
      notifyText: notifyTexts.reject,
    });
  };
  rejectRemarksElement = () => {
    return global.confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.reject(1),
    })
      .then(() =>
        this.rejectRemarksAction(
          this.state.selectedElement[this.selectField],
        ).then(() => {
          this.setState({ selectedElement: null });
          global.NOTIFICATION_SYSTEM.notify(notifyTexts.reject(1));
        }),
      )
      .catch(() => {
        //
      });
  };

  fixRemarksCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.fix,
      callbackForCheckedElement: this.fixRemarksAction,
      callBackForOneElement: this.fixRemarksElement,
      notifyText: notifyTexts.fix,
    });
  };
  fixRemarksElement = () => {
    return global.confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.fix(1),
    })
      .then(() =>
        this.fixRemarksAction(
          this.state.selectedElement[this.selectField],
        ).then(() => {
          this.setState({ selectedElement: null });
          global.NOTIFICATION_SYSTEM.notify(notifyTexts.fix(1));
        }),
      )
      .catch(() => {
        //
      });
  };

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

  /**
   * @override
   */
  getButtons = () => {
    const entity = (this.constructor as any).entity;
    const { program_version_status } = this.props;

    const buttons = [
      <ButtonDeleteNew
        buttonName={'Удалить'}
        key={0}
        onClick={this.removeCheckedElements}
        disabled={
          this.checkDisabledDelete()
          || program_version_status !== 'sent_on_review'
        }
        permission="route.review"
      />,
      <ButtonChangeStatus
        buttonName={'Отклонено'}
        key={1}
        onClick={this.rejectRemarksCheckedElements}
        disabled={
          this.checkDisabledDelete() || program_version_status !== 'rejected'
        }
        permission={`${entity}.update`}
      />,
      <ButtonChangeStatus
        buttonName={'Исправлено'}
        key={2}
        onClick={this.fixRemarksCheckedElements}
        disabled={
          this.checkDisabledDelete() || program_version_status !== 'rejected'
        }
        permission={`${entity}.update`}
      />,
      <ButtonCreateNew
        buttonName={'Добавить'}
        key={3}
        onClick={this.createElement}
        permission="route.review"
        disabled={program_version_status !== 'sent_on_review'}
      />,
    ];

    return buttons;
  };

  init() {
    this.context.flux
      .getActions('repair')
      .getRepairListByType('programRemarkRegistry', {
        program_version_id: this.props.program_version_id,
      });
  }

  getAdditionalProps = () => ({
    displayTable: this.props.programRemarkRegistryList.length !== 0,
  });
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(ProgramRemarkList);

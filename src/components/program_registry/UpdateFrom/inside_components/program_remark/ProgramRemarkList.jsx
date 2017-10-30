import * as React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { ButtonCreate, ButtonDelete } from 'components/ui/buttons/CRUD';

import ProgramRemarkTable from './ProgramRemarkTable';
import ProgramRemarkFormWrap from './ProgramRemarkFormWrap';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonChangeStatus = ({ permissions, onClick, disabled, buttonName }) =>
  <Button bsSize="small" onClick={onClick} permissions={permissions} disabled={disabled}>
    {buttonName}
  </Button>
;

const bodyConfirmDialogs = {
  remove(countCheckedElement) {
    return `Вы уверены, что хотите удалить выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'}?`;
  },
  reject(countCheckedElement) {
    return `Вы уверены, что хотите отклонить выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'}?`;
  },
  fix(countCheckedElement) {
    return `Вы уверены, что хотите перевести выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'} в статус "Исправлено"?`;
  },
};

const notifyTexts = {
  remove(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'} удал${countCheckedElement === 1 ? 'ено' : 'ены'}`;
  },
  reject(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'} отклон${countCheckedElement === 1 ? 'ено' : 'ены'}`;
  },
  fix(countCheckedElement) {
    return `У выбранн${countCheckedElement === 1 ? 'ого' : 'ых'} замечани${countCheckedElement === 1 ? 'я' : 'ий'} изменён статус на "Исправлено"`;
  },
};

@connectToStores(['repair', 'session'])
@staticProps({
  entity: 'repair_program_version',
  listName: 'programRemarkRegistryList',
  formComponent: ProgramRemarkFormWrap,
  tableComponent: ProgramRemarkTable,
  operations: [],
})
export default class ProgramRemarkList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    const {
      program_version_id,
    } = props;

    this.updateAction = context.flux.getActions('repair').getRepairListByType.bind(this, 'programRemarkRegistry', { program_version_id });
    this.rejectRemarksAction = context.flux.getActions('repair').rejectRemarks;
    this.fixRemarksAction = context.flux.getActions('repair').fixRemarks;
  }

  removeElementAction = (id) => {
    const {
      program_version_id,
    } = this.props;

    return this.context.flux.getActions('repair').removeProgramRemark(id, { program_version_id });
  }

  removeCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.remove,
      callbackForCheckedElement: this.removeElementAction,
      callBackForOneElement: this.removeElement,
      notifyText: notifyTexts.remove,
    });
  }
  /**
   * @override
   */
  removeElement = () => {
    return confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.remove(1),
    })
    .then(() => {
      const {
        selectedElement = {},
      } = this.state;
      const id = selectedElement[this.selectField];

      return this.removeElementAction(id).then(() => {
        this.setState({ selectedElement: null });
        global.NOTIFICATION_SYSTEM.notify(notifyTexts.remove(1));
      });
    })
    .catch(() => {});
  }

  rejectRemarksCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.reject,
      callbackForCheckedElement: this.rejectRemarksAction,
      callBackForOneElement: this.rejectRemarksElement,
      notifyText: notifyTexts.reject,
    });
  }
  rejectRemarksElement = () => {
    return confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.reject(1),
    })
    .then(() => {
      const {
        selectedElement = {},
      } = this.state;
      const id = selectedElement[this.selectField];

      return this.rejectRemarksAction(id).then(() => {
        this.setState({ selectedElement: null });
        global.NOTIFICATION_SYSTEM.notify(notifyTexts.reject(1));
      });
    })
    .catch(() => {});
  }

  fixRemarksCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: bodyConfirmDialogs.fix,
      callbackForCheckedElement: this.fixRemarksAction,
      callBackForOneElement: this.fixRemarksElement,
      notifyText: notifyTexts.fix,
    });
  }
  fixRemarksElement = () => {
    return confirmDialog({
      title: 'Внимание',
      body: bodyConfirmDialogs.fix(1),
    })
    .then(() => {
      const {
        selectedElement = {},
      } = this.state;
      const id = selectedElement[this.selectField];

      return this.fixRemarksAction(id).then(() => {
        this.setState({ selectedElement: null });
        global.NOTIFICATION_SYSTEM.notify(notifyTexts.fix(1));
      });
    })
    .catch(() => {});
  }

  defActionFunc = ({
    bodyConfirmDialog,
    callbackForCheckedElement,
    callBackForOneElement,
    notifyText,
  }) => {
    const {
      checkedElements = {},
    } = this.state;

    const checkElList = Object.values(checkedElements);
    const countCheckEl = checkElList.length;

    if (countCheckEl !== 0) {
      confirmDialog({
        title: 'Внимание',
        body: bodyConfirmDialog(countCheckEl),
      })
      .then(() => {
        const elList = Array(countCheckEl).fill(false);

        checkElList.forEach((el, i) => {
          callbackForCheckedElement(el[this.selectField]).then(() => {
            elList[i] = true;
            if (!elList.some(elD => !elD)) {
              this.updateAction();
              global.NOTIFICATION_SYSTEM.notify(notifyText(countCheckEl));
            }
          });
        });
        this.setState({
          checkedElements: {},
          selectedElement: null,
        });
      })
      .catch(() => {});
    } else {
      callBackForOneElement().then(() => {
        this.updateAction();
      });
    }
  }


  /**
   * @override
   */
  getButtons = () => {
    const entity = this.constructor.entity;
    const buttons = [
      <ButtonDelete
        buttonName={'Удалить'}
        key={0}
        onClick={this.removeCheckedElements}
        disabled={this.checkDisabledDelete()}
        permissions={[`${entity}.delete`]}
      />,
      <ButtonChangeStatus
        buttonName={'Отклонено'}
        key={1}
        onClick={this.rejectRemarksCheckedElements}
        disabled={this.checkDisabledDelete()}
        permissions={[`${entity}.update`]}
      />,
      <ButtonChangeStatus
        buttonName={'Исправлено'}
        key={2}
        onClick={this.fixRemarksCheckedElements}
        disabled={this.checkDisabledDelete()}
        permissions={[`${entity}.update`]}
      />,
      <ButtonCreate
        buttonName={'Добавить'}
        key={3}
        onClick={this.createElement}
        permissions={['repair_program_version.review']}
      />,
    ];

    return buttons;
  }

  init() {
    const {
      program_version_id,
    } = this.props;

    const { flux } = this.context;
    flux.getActions('repair').getRepairListByType('programRemarkRegistry', { program_version_id });
  }

  render() {
    const table = this.getTable();
    const forms = this.getForms();
    const additionalRender = this.additionalRender();
    const preloader = this.state.exportFetching && <Preloader type="mainpage" />;
    const {
      program_version_status,
    } = this.props;

    return (
      <div className="ets-page-wrap" ref={node => (this.node = node)}>
        {
          program_version_status === 'rejected' || (program_version_status !== 'draft' && this.props.programRemarkRegistryList.length !== 0)
          ?
            <div>
              {table}
              {additionalRender}
              {forms}
              {preloader}
            </div>
          :
            null
        }
      </div>
    );
  }

}

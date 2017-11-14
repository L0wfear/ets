import * as React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { ButtonCreate, ButtonRead, ButtonDelete } from 'components/ui/buttons/CRUD';

import ProgramObjectTable from './ProgramObjectTable';
import ProgramObjectFormWrap from './ProgramObjectFormWrap';

const Button = enhanceWithPermissions(BootstrapButton);

const bodyConfirmDialogs = {
  remove(countCheckedElement) {
    return `Вы уверены, что хотите удалить выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'}?`;
  },
};

const notifyTexts = {
  remove(countCheckedElement) {
    return `Выбранн${countCheckedElement === 1 ? 'ое' : 'ые'} замечани${countCheckedElement === 1 ? 'е' : 'я'} удал${countCheckedElement === 1 ? 'ено' : 'ены'}`;
  },
};

@connectToStores(['repair', 'session'])
@staticProps({
  entity: 'repair_program_version',
  listName: 'objectsList',
  tableComponent: ProgramObjectTable,
  formComponent: ProgramObjectFormWrap,
  operations: [],
})
export default class ProgramRemarkList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    const {
      program_version_id,
    } = props;

    this.updateAction = context.flux.getActions('repair').getRepairListByType.bind(this, 'objects', { program_version_id });
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

  createDT = () => {
    const {
      program_version_id,
      contract_number: contractor_number,
      contract_id: contractor_id,
    } = this.props;

    this.setState({
      ...this.state,
      showForm: true,
      selectedElement: {
        type_slug: 'dt',
        program_version_id,
        contractor_number,
        contractor_id,
        elements: [],
      },
    });
  }
  createODH = () => {
    const {
      program_version_id,
      contract_number: contractor_number,
      contract_id: contractor_id,
    } = this.props;

    this.setState({
      ...this.state,
      showForm: true,
      selectedElement: {
        type_slug: 'odh',
        program_version_id,
        contractor_number,
        contractor_id,
        elements: [],
      },
    });
  }


  /**
   * @override
   */
  getButtons = () => {
    const entity = this.constructor.entity;
    const {
      program_version_status,
    } = this.props;

    const buttons = [
      <ButtonDelete
        buttonName={'Удалить'}
        key={0}
        onClick={this.removeCheckedElements}
        disabled={this.checkDisabledDelete() || true}
        permissions={['repair_program_version.review']}
      />,
      <ButtonRead
        buttonName={'Посмотреть'}
        key={1}
        onClick={this.showForm}
        disabled={this.checkDisabledRead()}
        permissions={[`${entity}.update`]}
      />,
      <ButtonCreate
        buttonName={'Добавить ДТ'}
        key={2}
        onClick={this.createDT}
        permissions={[`${entity}.update`]}
      />,
      <ButtonCreate
        buttonName={'Добавить ОДХ'}
        key={3}
        onClick={this.createODH}
        disabled
        permissions={[`${entity}.update`]}
      />,
    ];

    return buttons;
  }

  init() {
    const {
      program_version_id,
    } = this.props;

    const { flux } = this.context;
    flux.getActions('repair').getRepairListByType('objects', { program_version_id });
  }

  getAdditionalProps = () => {
    return {
      displayTable: true,
    };
  }
}

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


@connectToStores(['repair', 'session'])
@staticProps({
  entity: 'program_remark_registry',
  listName: 'programRemarkRegistryList',
  formComponent: ProgramRemarkFormWrap,
  tableComponent: ProgramRemarkTable,
  operations: [],
})
export default class ProgramRemarkList extends CheckableElementsList {
  removeElementAction = (id) => {
    const {
      program_version_id,
    } = this.props;
    return this.context.flux.getActions('repair').removeProgramRemark(id, { program_version_id });
  }

  rejectRemarks = () => {
    console.log('rejectRemarks');
  }
  fixRemarks = () => {
    console.log('fixRemarks');
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
        onClick={this.rejectRemarks}
        disabled={this.checkDisabledDelete()}
        permissions={[`${entity}.delete`]}
      />,
      <ButtonChangeStatus
        buttonName={'Исправлено'}
        key={2}
        onClick={this.fixRemarks}
        disabled={this.checkDisabledDelete()}
        permissions={[`${entity}.delete`]}
      />,
      <ButtonCreate
        buttonName={'Добавить'}
        key={3}
        onClick={this.createElement}
        permissions={[`${entity}.create`]}
      />,
    ];

    return buttons;
  }
  componentDidMount() {
    super.componentDidMount();
    const {
      program_version_id,
    } = this.props;

    const { flux } = this.context;
    flux.getActions('repair').getRepairListByType('programRemarkRegistry', { program_version_id });
  }
}

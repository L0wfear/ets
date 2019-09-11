import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { FileField } from 'components/old/ui/input/fields';
import { compose, withProps } from 'recompose';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';

import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type AsigmentViewProps = {
  handleChange: any;
  state: any;
  errors: any;
  IS_CREATING: any;
  isPermitted: any;
  path: any;
};

const AsigmentView: React.FC<AsigmentViewProps> = (props) => {
  const {
    state: formState,
    errors,
    isPermitted,
    path,
  } = props;

  return <>
    <EtsBootstrap.Col md={12}>
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={12}>
          <h3>
            Информация о доверенности
          </h3>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    </EtsBootstrap.Col>
    <EtsBootstrap.Col md={6}>
      <ExtField
        id="assignment"
        type="string"
        label="Номер"
        value={formState.assignment}
        error={errors.assignment}
        disabled={!isPermitted}
        onChange={props.handleChange}
        boundKeys="assignment"
      />
    </EtsBootstrap.Col>
    <EtsBootstrap.Col md={6}>
      <DatePickerRange
        date_start_id="assignment_date_start"
        date_start_value={formState.assignment_date_start}
        date_start_error={errors.assignment_date_start}
        date_start_time={false}

        date_end_id="assignment_date_end"
        date_end_value={formState.assignment_date_end}
        date_end_error={errors.assignment_date_end}
        date_end_time={false}
        label="Период действия"
        disabled={!isPermitted}
        onChange={props.handleChange}
      />
    </EtsBootstrap.Col>
    <EtsBootstrap.Col md={12}>
      <FileField
        button_id="button-assignment_files"
        id="assignment_files"
        label="Файл/скан доверенности"
        modalKey={path}
        value={formState.assignment_files}
        onChange={props.handleChange}
        boundKeys="assignment_files"
        disabled={!isPermitted}
      />
    </EtsBootstrap.Col>
  </>;
};

export default compose<any, any>(
  withRequirePermission({
    permissions: employeePermissions.assignment_read,
  }),
  withProps((props: AsigmentViewProps) => ({ // Прокидывает пропсы в нижний клмпонент
    permissions: props.IS_CREATING ? employeePermissions.assignment_create : employeePermissions.assignment_update,
  })),
  withRequirePermission({
    withIsPermittedProps: true,
  }),
)(AsigmentView);

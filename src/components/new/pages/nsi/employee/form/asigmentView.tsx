import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FileField } from 'components/ui/input/fields';
import { compose, withProps } from 'recompose';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';

import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

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
    <Col md={12}>
      <Row>
        <Col md={12}>
          <h3>
            Информация о доверенности
          </h3>
        </Col>
      </Row>
    </Col>
    <Col md={6}>
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
    </Col>
    <Col md={6}>
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
    </Col>
    <Col md={12}>
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
    </Col>
  </>;
};

export default compose<any, any>(
  withRequirePermissionsNew({
    permissions: employeePermissions.assignment_read,
  }),
  withProps((props: AsigmentViewProps) => ({ // Прокидывает пропсы в нижний клмпонент
    permissions: props.IS_CREATING ? employeePermissions.assignment_create : employeePermissions.assignment_update,
  })),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(AsigmentView);

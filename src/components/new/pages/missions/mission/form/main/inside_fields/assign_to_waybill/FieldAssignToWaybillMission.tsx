
import * as React from 'react';

import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  PropsFieldAssignToWaybillMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/assign_to_waybill/FieldAssignToWaybillMission.d';
import styled from 'styled-components';

const ASSIGN_OPTIONS = [
  { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
  { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
  { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
];

const WrapExtField: any = styled(ExtField)`
  max-width: 300px;
  width: 100%;
  text-align: left;
  margin-right: 15px;

  flex-grow: 1;
`;

const FieldAssignToWaybillMission: React.FC<PropsFieldAssignToWaybillMission> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (value: string | null) => {
        props.onChange(value ? [value] : []);
      },
      [],
    );

    return (
      <WrapExtField
        id="assign_to_waybill"
        modalKey={props.page}
        type="select"
        label={props.label}
        options={ASSIGN_OPTIONS}
        value={props.value}
        error={false}
        onChange={handleChange}
        clearable={false}
      />
    );
  },
);

export default FieldAssignToWaybillMission;

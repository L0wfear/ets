
import * as React from 'react';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

type Props = {
  value: MissionTemplate['for_column'];
  error: string;
  disabled: boolean;
  onChange: (obj: { [key: string]: any; }) => any;

  page: string;
  path: string;
};

const FieldForColumnMission: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      () => {
        props.onChange({
          for_column: !props.value,

          technical_operation_id: null,
          technical_operation_name: '',
          municipal_facility_id: null,
          municipal_facility_name: '',
          route_id: null,
          route_name: '',
          route_type: null,
          object_type_id: null,
          object_type_name: '',

          consumable_materials: [],
        });
      },
      [props.onChange, props.value],
    );

    return (
      <ExtField
        id="for_column"
        modalKey={props.page}
        type="select"
        label="Колонна"
        disabled={props.disabled}
        value={+props.value}
        options={YES_NO_SELECT_OPTIONS_INT}
        onChange={handleChange}
        clearable={false}
      />
    );
  },
);

export default FieldForColumnMission;

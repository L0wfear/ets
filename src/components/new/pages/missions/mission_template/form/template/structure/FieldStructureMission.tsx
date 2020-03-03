import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  getSessionStructuresOptions,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

type Props = {
  value: MissionTemplate['structure_id'];
  name: MissionTemplate['structure_name'];
  disabled: boolean;
  error: string;
  handleChange: (obj: Partial<MissionTemplate>) => any;
  page: string;
  path: string;
};

const FieldStructureMission: React.FC<Props> = React.memo(
  (props) => {
    const STRUCTURES = etsUseSelector((state) => getSessionStructuresOptions(state));
    const SessionStructuresParams = etsUseSelector((state) => getSessionStructuresParams(state));

    const structure_id = props.value;
    const {
      error,
      page,
      handleChange,
    } = props;

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        if (valueNew !== structure_id) {
          handleChange({
            structure_id: valueNew,
            structure_name: get(option, 'label', null),
            car_gov_numbers: [],
            car_gov_numbers_text: '',
            car_ids: [],
            car_type_ids: [],
            car_model_names: [],
            car_special_model_names: [],
            car_type_names: [],

            technical_operation_id: null,
            technical_operation_name: '',
            municipal_facility_id: null,
            municipal_facility_name: '',
            route_id: null,
            route_name: '',
            route_type: null,
          });
        }
      },
      [handleChange, structure_id],
    );

    return (
      <ExtField
        type="select"
        id="structure_id"
        modalKey={page}
        label="Подразделение"
        disabled={SessionStructuresParams.STRUCTURE_FIELD_READONLY || props.disabled}
        clearable={SessionStructuresParams.STRUCTURE_FIELD_DELETABLE}
        options={STRUCTURES}
        placeholder="Не выбрано"
        emptyValue={null}
        value={structure_id}
        error={error}
        onChange={handleChangeWrap}
      />
    );
  },
);

export default FieldStructureMission;

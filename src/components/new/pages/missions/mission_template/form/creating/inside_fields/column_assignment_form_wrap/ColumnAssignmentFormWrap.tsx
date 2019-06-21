import * as React from 'react';
import ColumnAssignmentFormLazy from 'components/new/pages/missions/mission/form/main/column_assignment';

import {
  PropsMissionTemplateCreatingForm,
  MissionTemplateCreating,
} from '../../@types/MissionTemplateCreatingForm';
import { get } from 'lodash';

type ColumnAssignmentFormWrapProps = {
  missionTemplates: MissionTemplateCreating['missionTemplates'],
  assign_to_waybill: MissionTemplateCreating['assign_to_waybill'],
  showColumnAssignmentFormWrap: boolean;
  onChange: PropsMissionTemplateCreatingForm['handleChange'];
  handleSubmit: any;

  page: string;
  path: string;
};

const ColumnAssignmentFormWrap: React.FC<ColumnAssignmentFormWrapProps> = React.memo(
  (props) => {
    const car_ids = React.useMemo(
      () => {
        const [mission] = Object.values(props.missionTemplates);

        return get(mission, 'car_ids', null);
      },
      [props.missionTemplates],
    );
    const assign_to_waybill = React.useMemo(
      () => {
        return Object.values(props.assign_to_waybill)[0];
      },
      [props.assign_to_waybill],
    );

    const handleChangeAssignToWaybill = React.useCallback(
      (assign_to_waybill_new) => {
        const [key] = Object.keys(props.assign_to_waybill);

        props.onChange({
          assign_to_waybill: {
            [key]: assign_to_waybill_new,
          },
        });
      },
      [props.assign_to_waybill, props.onChange],
    );

    const handleSubmit: any = React.useCallback(
      () => {
        return props.handleSubmit(true);
      },
      [props.handleSubmit],
    );

    return (
      <ColumnAssignmentFormLazy
        showForm={props.showColumnAssignmentFormWrap}
        assign_to_waybill={assign_to_waybill}
        car_ids={car_ids}
        handleChangeAssignToWaybill={handleChangeAssignToWaybill}
        hideColumnAssignment={props.handleSubmit}
        handleSubmit={handleSubmit}

        page={props.page}
        path={props.path}
      />
    );
  },
);

export default ColumnAssignmentFormWrap;

import * as React from 'react';
import {
  PropsMissionTemplateCreatingForm,
  MissionTemplateCreating,
} from '../../@types/MissionTemplateCreatingForm';
import FieldAssignToWaybillMission from 'components/new/pages/missions/mission/form/main/inside_fields/assign_to_waybill/FieldAssignToWaybillMission';
import { DivNone } from 'global-styled/global-styled';

type FieldAssignToWaybillMissionTemplateCreatingProps = {
  assign_to_waybill: MissionTemplateCreating['assign_to_waybill'];
  missionTemplates: MissionTemplateCreating['missionTemplates'];
  onChange: PropsMissionTemplateCreatingForm['handleChange'];

  page: string;
};

const FieldAssignToWaybillMissionTemplateCreating: React.FC<FieldAssignToWaybillMissionTemplateCreatingProps> = React.memo(
  (props) => {
    const not_visible = React.useMemo(
      () => {
        return Object.values(props.missionTemplates).some(({ car_ids }) => car_ids.length > 1);
      },
      [props.missionTemplates],
    );
    const value = React.useMemo(
      () => {
        if (not_visible) {
          return null;
        }

        const assign_to_waybill_asArr = Object.values(props.assign_to_waybill);

        return assign_to_waybill_asArr[0][0];
      },
      [not_visible, props.assign_to_waybill],
    );

    const handleChange = React.useCallback(
      (assign_to_waybill) => {
        props.onChange({
          assign_to_waybill: Object.entries(props.assign_to_waybill).reduce(
            (newObj, [key, arrayData]) => {
              newObj[key] = arrayData.map(() => assign_to_waybill);

              return newObj;
            },
            {},
          ),
        });
      },
      [props.onChange, props.assign_to_waybill],
    );
    return (
      !not_visible
        ? (
          <FieldAssignToWaybillMission
            value={value}
            label={false}
            onChange={handleChange}

            page={props.page}
          />
        )
        : (
          <DivNone />
        )
    );
  },
);

export default FieldAssignToWaybillMissionTemplateCreating;

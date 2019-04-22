import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldNormIdMissionTemplateCreating,
  StatePropsFieldNormIdMissionTemplateCreating,
  DispatchPropsFieldNormIdMissionTemplateCreating,
  OwnPropsFieldNormIdMissionTemplateCreating,
  StateFieldNormIdMissionTemplateCreating,
} from 'components/missions/mission_template/form/creating/inside_fields/norm_id/FieldNormIdMissionTemplateCreating.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { DivNone } from 'global-styled/global-styled';
import { createValidDateTime } from 'utils/dates';

class FieldNormIdMissionTemplateCreating extends React.PureComponent<PropsFieldNormIdMissionTemplateCreating, StateFieldNormIdMissionTemplateCreating> {
  componentDidMount() {
    this.updateNormId();
  }

  componentDidUpdate(prevProps: PropsFieldNormIdMissionTemplateCreating) {
    const {
      date_start,
    } = this.props;

    const triggerOnUpdate = (
      date_start !== prevProps.date_start
    );

    if (triggerOnUpdate) {
      this.updateNormId();
    }
  }

  async updateNormId() {
    const {
      date_start,
      missionTemplates,

      page,
      path,
    } = this.props;

    const hasAllData = Boolean(date_start);

    if (hasAllData) {
      const missionTemplatesAsArr = await Promise.all(
        Object.entries(missionTemplates).map(async ([key, missionData]) => {
          const normData = await Promise.all(
            missionData.car_type_ids.map((func_type_id) => {
              return this.props.actionLoadCleaningOneNorm(
                {
                  datetime: createValidDateTime(date_start),
                  technical_operation_id: missionData.technical_operation_id,
                  municipal_facility_id: missionData.municipal_facility_id,
                  route_type: missionData.route_type,
                  needs_brigade: false,
                  func_type_id,
                },
                {
                  page,
                  path,
                },
              );
            }),
          );

          return {
            [key]: {
              ...missionData,
              norm_ids: normData.map(({ norm_id }) => norm_id),
              is_cleaning_norm: normData.map(({ is_cleaning_norm }) => is_cleaning_norm),
            },
          };
        }),
      );
      this.props.onChange({
        missionTemplates: missionTemplatesAsArr.reduce(
          (newObj, missionObjData) => {
            Object.entries(missionObjData).forEach(([key, missionData]) => {
              newObj[key] = missionData;
            });

            return newObj;
          },
          {},
        ),
      });

    } else if (length) {
      this.props.onChange({
        missionTemplates: Object.entries(missionTemplates).reduce(
          (newObj, [key, missionData]) => {
            newObj[key] = {
              ...missionData,
              norm_ids: missionData.car_type_ids.map(() => null),
              is_cleaning_norm: missionData.car_type_ids.map(() => null),
            };

            return newObj;
          },
          {},
        ),
      });
    }
  }

  render() {
    return <DivNone>norm_id</DivNone>;
  }
}

export default connect<StatePropsFieldNormIdMissionTemplateCreating, DispatchPropsFieldNormIdMissionTemplateCreating, OwnPropsFieldNormIdMissionTemplateCreating, ReduxState>(
  null,
  (dispatch: any) => ({
    actionLoadCleaningOneNorm: (...arg) =>
      dispatch(someUniqActions.actionLoadCleaningOneNorm(...arg)),
  }),
)(FieldNormIdMissionTemplateCreating);

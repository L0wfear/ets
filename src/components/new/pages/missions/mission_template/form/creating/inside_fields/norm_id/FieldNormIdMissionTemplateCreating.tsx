import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import { DivNone } from 'global-styled/global-styled';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { actionLoadCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/actions';

import {
  PropsMissionTemplateCreatingForm,
  MissionTemplateCreating,
} from '../../@types/MissionTemplateCreatingForm';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getValidOneNormPayload } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';

type StateProps = {
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type OwnProps = {
  date_start: MissionTemplateCreating['date_start'];
  missionTemplates: MissionTemplateCreating['missionTemplates'];
  onChange: PropsMissionTemplateCreatingForm['handleChange'];

  page: string;
  path: string;
};

type PropsFieldNormIdMissionTemplateCreating = (
  StateProps
  & DispatchProps
  & OwnProps
);

class FieldNormIdMissionTemplateCreating extends React.PureComponent<PropsFieldNormIdMissionTemplateCreating, {}> {
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
    } = this.props;

    const hasAllData = Boolean(date_start);

    if (hasAllData) {
      const missionTemplatesAsArr = await Promise.all(
        Object.entries(missionTemplates).map(async ([key, missionData]) => {
          const normData = await Promise.all(
            missionData.car_type_ids.map((func_type_id) => {
              return this.props.dispatch(
                actionLoadCleaningOneNorm(
                  getValidOneNormPayload({
                    datetime: createValidDateTime(date_start),
                    technical_operation_id: missionData.technical_operation_id,
                    municipal_facility_id: missionData.municipal_facility_id,
                    route_type: missionData.route_type,
                    needs_brigade: false,
                    func_type_id,
                  }),
                  this.props,
                ),
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

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  null,
)(FieldNormIdMissionTemplateCreating);

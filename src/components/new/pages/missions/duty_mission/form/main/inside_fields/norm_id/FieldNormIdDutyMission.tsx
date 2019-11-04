import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ReduxState } from 'redux-main/@types/state';
import { DivNone } from 'global-styled/global-styled';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { actionLoadCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/actions';

import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getValidOneNormPayload } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';

type StateProps = {};

type DispatchProps = {
  dispatch: EtsDispatch;
};

type OwnProps = {
  value: DutyMission['norm_id'];
  datetime: DutyMission['plan_date_start'];
  technical_operation_id: DutyMission['technical_operation_id'];
  municipal_facility_id: DutyMission['municipal_facility_id'];
  route_type: DutyMission['route_type'];

  disabled: boolean;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  IS_TEMPLATE: boolean;
  DUTY_MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

/**
 * Пустой рендер для вычисления норматива (norm_id)
 * Зависит от ТО, Элемента, маршурта и даты начала
 */
class FieldNormIdDutyMission extends React.PureComponent<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    const {
      disabled,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_type,
    } = this.props;

    const triggerOnUpdate = (
      !disabled
      && (datetime !== prevProps.datetime
        || technical_operation_id !== prevProps.technical_operation_id
        || municipal_facility_id !== prevProps.municipal_facility_id
        || route_type !== prevProps.route_type
      )
    );

    if (triggerOnUpdate) {
      this.updateNormId(); // в том числе, нужен в для определения is_cleaning_norm, используется в валидации
    }
  }

  async updateNormId() {
    const {
      value,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_type,
      DUTY_MISSION_IS_ORDER_SOURCE,
    } = this.props;

    const hasAllData = datetime && technical_operation_id && municipal_facility_id && route_type;

    if (hasAllData) {
      const payload = {
        datetime: createValidDateTime(datetime),
        technical_operation_id,
        municipal_facility_id,
        route_type,
        needs_brigade: true,
        kind_task_ids: DUTY_MISSION_IS_ORDER_SOURCE ? [1, 2] : 3,
      };

      try {
        const oneNorm = await this.props.dispatch(
          actionLoadCleaningOneNorm(
            getValidOneNormPayload(payload),
            this.props,
          ),
        );

        const normObj = this.props.DUTY_MISSION_IS_ORDER_SOURCE
          ? {
            is_cleaning_norm: get(oneNorm, 'is_cleaning_norm', null),
          } : {
            norm_id: get(oneNorm, 'norm_id', null),
            norm_text: get(oneNorm, 'name', null),
            is_cleaning_norm: get(oneNorm, 'is_cleaning_norm', null),
          };

        this.props.onChange(normObj);
      } catch (error) {
        this.props.onChange({
          norm_id: null,
          norm_text: null,
          is_cleaning_norm: false,
        });
      }
    } else if (value) {
      this.props.onChange({
        norm_id: null,
        norm_text: null,
        is_cleaning_norm: false,
      });
    }
  }

  render() {
    return <DivNone>norm_id</DivNone>;
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  null,
)(FieldNormIdDutyMission);

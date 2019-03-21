import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import MissionFormLazy from 'components/missions/mission/form/main';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import { edc_form_permitted_type } from '../_config-data/contants';
import DutyMissionFormLazy from 'components/missions/duty_mission/form/main';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { diffDates, getDateWithMoscowTz } from 'utils/dates';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import memoizeOne from 'memoize-one';

type EdcRequestFormLazyDispatchProps = {
  actionSetDependenceEdcRequestForMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceEdcRequestForMission>;
  actionSetDependenceEdcRequestForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceEdcRequestForDutyMission>;
};

type EdcRequestFormLazy = (
  EdcRequestFormLazyDispatchProps
  & {
    registryKey: string;
    element: EdcRequest;
    onFormHide: (isSubmitted: boolean, response?: any) => void;
    path?: string;
  } & WithSearchProps
);

const getDefaultMissionByEdcRequest = memoizeOne(
  (edc_request: EdcRequest): Partial<Mission> => {
    const mission: Partial<Mission> = {
      request_id: edc_request.id,
      request_number: edc_request.request_number,
      mission_source_id: 5, // заявка
    };
    const {
      desired_time_from,
      desired_time_to,
    } = edc_request;
    const triggerOnSetDates = (
      desired_time_from
      && desired_time_to
      && diffDates(desired_time_to, desired_time_from) > 0
      && diffDates(desired_time_from, getDateWithMoscowTz()) > 0
    );
    if (triggerOnSetDates) {
      mission.date_start = desired_time_from;
      mission.date_end = desired_time_to;
    }

    return mission;
  },
);

const getDefaultDutyMissionByEdcRequest = memoizeOne(
  (edc_request: EdcRequest): Partial<DutyMission> => {
    const mission: Partial<DutyMission> = {
      request_id: edc_request.id,
      request_number: edc_request.request_number,
      mission_source_id: 5, // заявка
    };
    const {
      desired_time_from,
      desired_time_to,
    } = edc_request;
    const triggerOnSetDates = (
      desired_time_from
      && desired_time_to
      && diffDates(desired_time_to, desired_time_from) > 0
      && diffDates(desired_time_from, getDateWithMoscowTz()) > 0
    );
    if (triggerOnSetDates) {
      mission.plan_date_start = desired_time_from;
      mission.plan_date_end = desired_time_to;
    }

    return mission;
  },
);

const EdcRequestFormLazy: React.FC<EdcRequestFormLazy> = (props) => {
  const type = get(props.match, 'params.type', null);

  const page = props.registryKey;
  const path = `${props.path ? `${props.path}-` : ''}edc`;

  React.useEffect(
    () => {
      if (!edc_form_permitted_type[type]) {
        props.onFormHide(false);
      }
      if (props.element) {
        if (type === edc_form_permitted_type.mission) {
          props.actionSetDependenceEdcRequestForMission(
            props.element,
          );
        }
        if (type === edc_form_permitted_type.duty_mission) {
          props.actionSetDependenceEdcRequestForDutyMission(
            props.element,
          );
        }
      }
    },
    [props.element, type],
  );

  if (!props.element) {
    return (
      <DivNone />
    );
  }

  if (type === edc_form_permitted_type.mission) {
    return (
      <MissionFormLazy
        showForm
        element={getDefaultMissionByEdcRequest(props.element)}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  if (type === edc_form_permitted_type.duty_mission) {
    return (
      <DutyMissionFormLazy
        showForm
        element={getDefaultDutyMissionByEdcRequest(props.element)}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  return <DivNone />;
};

export default compose<any, any>(
  connect<null, EdcRequestFormLazyDispatchProps, any, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionSetDependenceEdcRequestForMission: (...arg) => (
        dispatch(
          missionsActions.actionSetDependenceEdcRequestForMission(...arg),
        )
      ),
      actionSetDependenceEdcRequestForDutyMission: (...arg) => (
        dispatch(
          missionsActions.actionSetDependenceEdcRequestForDutyMission(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withFormRegistrySearch,
)(EdcRequestFormLazy);

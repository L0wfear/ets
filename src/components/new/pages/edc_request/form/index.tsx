import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { diffDates, getDateWithMoscowTz, createValidDateTime, makeDataFromRaw, isValidDate } from 'utils/dates';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import * as memoizeOne from 'memoize-one';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { edc_form_permitted_type_reverse } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';
import EdcRequestCancelFormLazy from './cancel';
import { EdcRequestCancel } from './cancel/@types/EdcRequestCancel';
import EdcRequestRejectFormLazy from './reject';
import RequestInfoFormLazy from './requestInfo';

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

const getDatesEdcRequest = (edc_request: EdcRequest) => {
  const ans = {
    desired_date_from: null,
    desired_date_to: null,
  };

  const {
    desired_time_from,
    desired_time_to,
    desired_date,
  } = edc_request;
  const triggerOnHasDesiredDates = (
    desired_date
    && desired_time_from
    && desired_time_to
  );

  if (triggerOnHasDesiredDates) {
    const desired_date_from = createValidDateTime(makeDataFromRaw(desired_date, desired_time_from));
    const desired_date_to = createValidDateTime(makeDataFromRaw(desired_date, desired_time_to));

    const triggerOnSetDates = (
      isValidDate(desired_date_to)
      && isValidDate(desired_date_from)
      && diffDates(desired_date_to, desired_date_from) > 0
      && diffDates(desired_date_from, getDateWithMoscowTz()) > 0
    );
    if (triggerOnSetDates) {
      ans.desired_date_from = desired_date_from;
      ans.desired_date_to = desired_date_to;
    }
  }

  return ans;
};

const getDefaultMissionByEdcRequest = memoizeOne(
  (edc_request: EdcRequest): Partial<Mission> => {
    const edc_dates = getDatesEdcRequest(edc_request);

    const mission: Partial<Mission> = {
      request_id: edc_request.id,
      request_number: edc_request.request_number,
      mission_source_id: 5, // заявка
      date_start: edc_dates.desired_date_from || null,
      date_end: edc_dates.desired_date_to || null,
    };

    return mission;
  },
);

const getDefaultDutyMissionByEdcRequest = memoizeOne(
  (edc_request: EdcRequest): Partial<DutyMission> => {
    const edc_dates = getDatesEdcRequest(edc_request);

    const dutyMission: Partial<DutyMission> = {
      request_id: edc_request.id,
      request_number: edc_request.request_number,
      mission_source_id: 5, // заявка
      plan_date_start: edc_dates.desired_date_from || null,
      plan_date_end: edc_dates.desired_date_to || null,
    };

    return dutyMission;
  },
);

const getDefaultEdcRequestCancelElement = memoizeOne(
  (edc_request: EdcRequest): Partial<EdcRequestCancel> => {
    return {
      id: edc_request.id,
    };
  },
);

const EdcRequestFormLazy: React.FC<EdcRequestFormLazy> = (props) => {
  const type = get(props.match, 'params.type', null);

  const page = props.registryKey;
  const path = `${props.path ? `${props.path}-` : ''}edc`;

  React.useEffect(
    () => {
      if (!edc_form_permitted_type_reverse[type]) {
        props.onFormHide(false);
      }
      if (props.element) {
        if (type === buttonsTypes.edc_request_create_mission) {
          props.actionSetDependenceEdcRequestForMission(
            props.element,
          );
        }
        if (type === buttonsTypes.edc_request_create_duty_mission) {
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

  if (type === buttonsTypes.edc_request_create_mission) {
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

  if (type === buttonsTypes.edc_request_create_duty_mission) {
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

  if (type === buttonsTypes.edc_request_cancel) {
    return (
      <EdcRequestCancelFormLazy
        showForm
        element={getDefaultEdcRequestCancelElement(props.element)}
        edcReques={props.element}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  if (type === buttonsTypes.edc_request_reject) {
    return (
      <EdcRequestRejectFormLazy
        showForm
        element={getDefaultEdcRequestCancelElement(props.element)}
        edcReques={props.element}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  if (type === buttonsTypes.edc_request_info) {
    return (
      <RequestInfoFormLazy
        element={props.element}
        registryKey={page}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  return <DivNone />;
};

export default compose<any, any>(
  withFormRegistrySearch({}),
  connect<null, EdcRequestFormLazyDispatchProps, any, ReduxState>(
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
  ),
)(EdcRequestFormLazy);

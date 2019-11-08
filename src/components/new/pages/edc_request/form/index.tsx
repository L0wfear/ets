import * as React from 'react';
import { get } from 'lodash';
import memoizeOne from 'memoize-one';

import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import DutyMissionFormWithoutRegistry from 'components/new/pages/missions/duty_mission/form/main/DutyMissionFormWithoutRegistry';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { diffDates, getDateWithMoscowTz, createValidDateTime, makeDataFromRaw, isValidDate } from 'components/@next/@utils/dates/dates';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { edc_form_permitted_type_reverse } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';
import EdcRequestCancelFormLazy from './cancel';
import { EdcRequestCancel } from './cancel/@types/EdcRequestCancel';
import EdcRequestRejectFormLazy from './reject';
import RequestInfoFormLazy from './requestInfo';
import RequestCommentsFormLazy from 'components/new/pages/edc_request/form/comments';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';

type OwnProps = WithFormRegistrySearchProps;
type Props = OwnProps & WithFormRegistrySearchAddProps<Pick<EdcRequest, 'id'>>;

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

const EdcRequestFormLazy: React.FC<Props> = (props) => {
  const [edc, setEdc] = React.useState<EdcRequest>(null);
  const type = get(props.match, 'params.type', null);

  const page = props.page;
  const path = props.path;

  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      if (props.element) {
        const loadAction = async () => {
          const edc_reques = await dispatch(
            edcRequestActions.actionLoadEdcRequestById(props.element.id, props),
          );

          setEdc(edc_reques);
        };

        loadAction();
      }
    },
    [props.element],
  );

  React.useEffect(
    () => {
      if (!edc_form_permitted_type_reverse[type] && (type !== 'comments')) {
        props.handleHide(false);
      }
      if (props.element) {
        if (type === buttonsTypes.edc_request_create_mission) {
          dispatch(
            missionsActions.actionSetDependenceEdcRequestForMission(
              edc,
            ),
          );
        }
        if (type === buttonsTypes.edc_request_create_duty_mission) {
          dispatch(
            missionsActions.actionSetDependenceEdcRequestForDutyMission(
              edc,
            ),
          );
        }
      }
    },
    [edc, type],
  );

  if (edc) {
    if (type === buttonsTypes.edc_request_create_mission) {
      return (
        <MissionFormLazy
          showForm
          element={getDefaultMissionByEdcRequest(edc)}
          handleHide={props.handleHide}

          registryKey={props.page}
          type={null}
          page={page}
          path={path}
        />
      );
    }

    if (type === buttonsTypes.edc_request_create_duty_mission) {
      return (
        <DutyMissionFormWithoutRegistry
          showForm
          element={getDefaultDutyMissionByEdcRequest(edc)}
          handleHide={props.handleHide}
          type={null}

          page={page}
          registryKey={page}
          path={path}
        />
      );
    }

    if (type === buttonsTypes.edc_request_cancel) {
      return (
        <EdcRequestCancelFormLazy
          showForm
          element={getDefaultEdcRequestCancelElement(edc)}
          edcReques={edc}
          onFormHide={props.handleHide}

          page={page}
          path={path}
        />
      );
    }

    if (type === buttonsTypes.edc_request_reject) {
      return (
        <EdcRequestRejectFormLazy
          showForm
          element={getDefaultEdcRequestCancelElement(edc)}
          edcReques={edc}
          onFormHide={props.handleHide}

          page={page}
          path={path}
        />
      );
    }

    if (type === 'info') {
      return (
        <RequestInfoFormLazy
          element={edc}
          registryKey={page}
          onFormHide={props.handleHide}

          page={page}
          path={path}
        />
      );
    }

    if (type === 'comments') {
      return (
        <RequestCommentsFormLazy
          showForm

          element={props.element}
          onFormHide={props.handleHide}

          page={page}
          path={path}
        />
      );
    }
  }

  return null;
};

export default withFormRegistrySearch<OwnProps, Pick<EdcRequest, 'id'>>({
  add_path: 'edc',
  no_find_in_arr: true,
})(EdcRequestFormLazy);

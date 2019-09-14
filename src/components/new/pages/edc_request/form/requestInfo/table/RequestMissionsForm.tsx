import * as React from 'react';
import { get } from 'lodash';
// import withFormRegistrySearch from "components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch";
import { DivNone } from "global-styled/global-styled";
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getConfig, registryKey } from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';
import { isNullOrUndefined } from 'util';

type OwnProps = {
  edcRequestInfoList: EdcRequestInfo[];
};
type Props = OwnProps & WithSearchProps;

const RequestMissionsForm: React.FC<Props> = React.memo(
  (props) => {
    const uniqKeyForParams = getConfig([], 0).list.data.uniqKeyForParams; /// <<< добавить index, для registry пока непонятно откуда
    const id = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);

    const handleHide = React.useCallback(
      () => {
        props.setParams({
          [uniqKeyForParams]: null,
        });
      },
      [uniqKeyForParams, props.setParams],
    );

    const element = React.useMemo(() => {
      return props.edcRequestInfoList.reduce((newArr, elem) => {
        return [
          ...newArr,
          ...elem.missions,
        ];
      }, []).find(
        (mission) =>
          mission.front_custom_id === id,
      );
    }, [props.edcRequestInfoList, id]);

    const rawElement = React.useMemo(
      () => {
        return {
          id: get(element, 'id', null),
        };
      },
      [element],
    );

    if (isNullOrUndefined(id) || isNaN(id)) {
      return (
        <DivNone />
      );
    }

    if (isNullOrUndefined(element)) {
      global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
      handleHide();
      return (
        <DivNone />
      );
    }

    const type_mission = get(element, 'type_mission', null);

    if (type_mission === 'mission') {
      return (
        <MissionFormLazy
          showForm
          element={rawElement}
          onFormHide={handleHide}

          page={registryKey}
        />
      );
    }

    if (type_mission === 'duty_mission') {
      return (
        <DutyMissionFormLazy
          showForm
          element={rawElement}
          handleHide={handleHide}

          page={registryKey}
          type={null}
          registryKey={registryKey}
          path="duty_mission_form"
        />
      );
    }

    return (
      <DivNone />
    );
  },
);

export default withSearch<OwnProps>(RequestMissionsForm);

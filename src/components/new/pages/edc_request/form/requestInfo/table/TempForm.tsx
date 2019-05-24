import * as React from 'react';
import { get } from 'lodash';
import withFormRegistrySearch from "components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch";
import { DivNone } from "global-styled/global-styled";
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getConfig, registryKey } from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';

type TempFormProps = (
  {
    edcRequestInfoList: EdcRequestInfo[];
  }
) & WithSearchProps;

const TempForm: React.FC<TempFormProps> = (props) => {
  const uniqKeyForParams = getConfig([]).list.data.uniqKeyForParams;
  const id = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);

  const handleHide = React.useCallback(
    (isSubmitted: boolean, response?: any) => {
      props.setParams({
        [uniqKeyForParams]: null,
      });
    },
    [uniqKeyForParams, props.setParams],
  );

  if (!id || isNaN(id)) {
    return (
      <DivNone />
    );
  }

  const element = findElementMe(props.edcRequestInfoList, id);

  if (!element) {
    global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
    handleHide(false);
  }

  const type_mission = get(element, 'type_mission');

  const rawElement = React.useMemo(
    () => {
      return {
        id: element.id,
      };
    },
    [element],
  );

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
        onFormHide={handleHide}

        page={registryKey}
      />
    );
  }

  return (
    <DivNone />
  );
};

export default withSearch(TempForm);

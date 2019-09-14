import * as React from 'react';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import MissionInfoFormWrap from './MissionInfoFormWrap';
import { actionLoadMissionData } from 'redux-main/reducers/modules/missions/mission/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const MissionInfoFormById: React.FC<WithFormRegistrySearchAddProps<Partial<Mission>>> = React.memo(
  (props) => {
    const [missionInfoElement, setMissionInfoElement] = React.useState(null);

    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        const loadData = async () => {
          try {
            const missionData = await dispatch(
              actionLoadMissionData(
                props.element.id,
                {
                  page: props.page,
                },
              ),
            );

            if (!missionData) {
              props.handleHide(false);
            } else {
              setMissionInfoElement(missionData);
            }
          } catch (e) {
            props.handleHide(false);
          }
        };

        loadData();
      },
      [props.element],
    );

    return (
      <MissionInfoFormWrap
        onFormHide={props.handleHide}
        showForm={Boolean(missionInfoElement)}
        element={missionInfoElement}
      />
    );
  },
);

export default MissionInfoFormById;

import * as React from 'react';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import MissionInfoFormWrap from './MissionInfoFormWrap';
import { useDispatch } from 'react-redux';
import { actionLoadMissionData } from 'redux-main/reducers/modules/missions/mission/actions';

type Props = {
  element: Partial<Mission>;
  handleHide: any;
  page: string;
  path: string;
};

const MissionInfoFormById: React.FC<Props> = React.memo(
  (props) => {
    const [missionInfoElement, setMissionInfoElement] = React.useState(null);

    const dispatch = useDispatch();

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

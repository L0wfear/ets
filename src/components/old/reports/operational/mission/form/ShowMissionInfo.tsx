import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ReportFormWrap from 'components/old/reports/operational/mission/form/ReportFormWrap';
import { actionLoadMissionData } from 'redux-main/reducers/modules/missions/mission/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

type OwnProps = {
  id: number;
};

const AlignCenter = styled.div`
  display: inline-flex;
  justify-content: center;
  width: 100%;
`;

const ShowMissionInfo: React.FC<OwnProps> = React.memo(
  ({ id }) => {
    const [showForm, setShowForm] = React.useState(false);
    const [missionInfoElement, setMissionInfoElement] = React.useState(null);

    const onMapFormHide = React.useCallback(() => {
      setShowForm(false);
    }, []);
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        const loadData = async () => {
          try {
            const missionData = await dispatch(
              actionLoadMissionData(
                id,
                {
                  page: '',
                },
              ),
            );

            if (!missionData) {
              onMapFormHide();
            } else {
              setMissionInfoElement(missionData);
            }
          } catch (e) {
            onMapFormHide();
          }
        };
        if (showForm) {
          loadData();
        }
      },
      [id, showForm],
    );

    const handleClick: any = React.useCallback(() => {
      setShowForm(true);
    }, []);

    return (
      <>
        <AlignCenter>
          <EtsBootstrap.Glyphicon onClick={handleClick} glyph="info-sign" fontSize="32px" color={UiConstants.colorError} />
        </AlignCenter>
        {showForm && missionInfoElement
          && <ReportFormWrap
            onFormHide={onMapFormHide}
            element={missionInfoElement}
          />}
      </>
    );
  },
);

export default ShowMissionInfo;

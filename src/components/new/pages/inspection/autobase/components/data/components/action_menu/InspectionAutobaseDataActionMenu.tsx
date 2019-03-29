import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { Row, Col } from 'react-bootstrap';
import { LineData, StatusLabel, LineDataButtonLine, InspectInfo } from './styled/InspectionAutobaseDataActionMenu';
import { getDateWithMoscowTz, makeDate, makeTime } from 'utils/dates';
import ButtonCreateInspectAutobase from 'components/new/pages/inspection/autobase/components/data/components/action_menu/components/button_inspect_autobase/ButtonCreateInspectAutobase';
import ButtonContinueInspectAutobase from 'components/new/pages/inspection/autobase/components/data/components/action_menu/components/button_inspect_autobase/ButtonContinueInspectAutobase';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { DispatchProp, connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { STATUS_TITLE_BY_SLUG, STATUS_INSPECT_AUTOBASE_CONDITING, STATUS_INSPECT_AUTOBASE_COMPLETED } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_constants';
import { DivNone } from 'global-styled/global-styled';
import ButtonCloseInspectAutobase from './components/button_inspect_autobase/ButtonCloseInspectAutobase';
import { get } from 'lodash';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getLastConductingInspect, geLastCompletedInspect } from '../../../../@selectors';

type InspectionAutobaseDataActionMenuStateProps = {
  lastConductingInspect: IStateInspectAutobase['lastConductingInspect'];
  lastCompletedInspect: IStateInspectAutobase['lastCompletedInspect'];
};

type InspectionAutobaseDataActionMenuDispatchProps = DispatchProp;
type InspectionAutobaseDataActionMenuOwnProps = {
  loadingPage: string;
  loadRegistryData: () => Promise<void>;
};

type InspectionAutobaseDataActionMenuProps = (
  InspectionAutobaseDataActionMenuStateProps
  & InspectionAutobaseDataActionMenuDispatchProps
  & InspectionAutobaseDataActionMenuOwnProps
);

const STATUS = {
  noToday: 0,
  conditionLast: 1,
  completedLast: 2,
};

const getLabel = (status: number) => {
  switch (status) {
    case STATUS.noToday: return 'На текущий день проверка не создана';
    case STATUS.conditionLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_AUTOBASE_CONDITING];
    case STATUS.completedLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_AUTOBASE_COMPLETED];
  }
};

const InspectionAutobaseDataActionMenu: React.FC<InspectionAutobaseDataActionMenuProps> = (props) => {
  const [status, setStatus] = React.useState(STATUS.noToday);
  const {
    lastConductingInspect,
    lastCompletedInspect,
  } = props;

  React.useEffect(
    () => {
      if (lastConductingInspect) {
        if (status !== STATUS.conditionLast) {
          setStatus(STATUS.conditionLast);
        }
      } else {
        if (lastCompletedInspect) {
          if (status !== STATUS.completedLast) {
            setStatus(STATUS.completedLast);
          }
        } else {
          if (status !== STATUS.noToday) {
            setStatus(STATUS.noToday);
          }
        }
      }
    },
    [status, lastConductingInspect, lastCompletedInspect],
  );

  return (
    <BoxContainer>
      <h4>
        <Row>
          <Col md={6} sm={6}>
            Информация о текущей проверке
          </Col>
          <Col md={6} sm={6}>
            {makeDate(getDateWithMoscowTz())}
          </Col>
        </Row>
      </h4>
      <Row>
        <InspectInfo>
          <LineData>
            Статус проверки: <StatusLabel>{getLabel(status)}</StatusLabel>
          </LineData>
          <LineData>
            &nbsp;
          </LineData>
          {
            true || status === STATUS.noToday && !lastConductingInspect && !lastCompletedInspect
              ? (
                <LineData>
                  <ButtonCreateInspectAutobase
                    loadRegistryData={props.loadRegistryData}
                    loadingPage={props.loadingPage}
                  />
                </LineData>
              )
              : (
                <DivNone />
              )
          }
          {
            status === STATUS.conditionLast && lastConductingInspect
              ? (
                <>
                  <LineData>
                    <div>
                      <span>Проверка открыта:</span><StatusLabel>{makeDate(get(lastConductingInspect, 'date_start', null))}</StatusLabel>
                    </div>
                    <div>
                      <span>Пользователем:</span><StatusLabel>{get(lastConductingInspect, 'open_employee_fio', '')}</StatusLabel>
                    </div>
                  </LineData>
                  <LineDataButtonLine>
                    <ButtonContinueInspectAutobase loadingPage={props.loadingPage} />
                    <ButtonCloseInspectAutobase loadingPage={props.loadingPage} />
                    <span>* При завершении проверки карточку базы нельзя будет отредактировать</span>
                  </LineDataButtonLine>
                </>
              )
              : (
                <DivNone />
              )
          }
          {
            status === STATUS.completedLast && lastCompletedInspect
              ? (
                <>
                  <LineData>
                    <span>Проверка завершена:</span><StatusLabel>{makeDate(get(lastCompletedInspect, 'date_end', null))}</StatusLabel>
                    <span>в</span><StatusLabel>{makeTime(get(lastCompletedInspect, 'date_end', null))}</StatusLabel>
                    <span>Пользователем:</span><StatusLabel>{get(lastCompletedInspect, 'close_employee_fio', '')}</StatusLabel>
                  </LineData>
                </>
              )
              : (
                <DivNone />
              )
          }
        </InspectInfo>
      </Row>
    </BoxContainer>
  );
};

export default compose<InspectionAutobaseDataActionMenuProps, InspectionAutobaseDataActionMenuOwnProps>(
  connect<InspectionAutobaseDataActionMenuStateProps, DispatchProp, InspectionAutobaseDataActionMenuOwnProps, any, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)),
      lastCompletedInspect: geLastCompletedInspect(getListData(getRegistryState(state), loadingPage)),
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
)(InspectionAutobaseDataActionMenu);

import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/pgm_base/components/data/styled/InspectionPgmBaseData';
import { Row, Col } from 'react-bootstrap';
import { LineData, StatusLabel, LineDataButtonLine, InspectInfo } from './styled/InspectionPgmBaseDataActionMenu';
import { getDateWithMoscowTz, makeDate, makeTime } from 'utils/dates';
import ButtonCreateInspectPgmBase from 'components/new/pages/inspection/pgm_base/components/data/components/action_menu/components/button_inspect_pgm_base/ButtonCreateInspectPgmBase';
import ButtonContinueInspectPgmBase from 'components/new/pages/inspection/pgm_base/components/data/components/action_menu/components/button_inspect_pgm_base/ButtonContinueInspectPgmBase';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { DispatchProp, connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { STATUS_TITLE_BY_SLUG, STATUS_INSPECT_PGM_BASE_CONDITING, STATUS_INSPECT_PGM_BASE_COMPLETED } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_constants';
import { DivNone } from 'global-styled/global-styled';
import ButtonCloseInspectPgmBase from './components/button_inspect_pgm_base/ButtonCloseInspectPgmBase';
import { get } from 'lodash';

type InspectionPgmBaseDataActionMenuStateProps = {
  lastConductingInspect: IStateInspectPgmBase['lastConductingInspect'];
  lastCompletedInspect: IStateInspectPgmBase['lastCompletedInspect'];
};

type InspectionPgmBaseDataActionMenuDispatchProps = DispatchProp;
type InspectionPgmBaseDataActionMenuOwnProps = {
  loadingPage: string;
};

type InspectionPgmBaseDataActionMenuProps = (
  InspectionPgmBaseDataActionMenuStateProps
  & InspectionPgmBaseDataActionMenuDispatchProps
  & InspectionPgmBaseDataActionMenuOwnProps
);

const STATUS = {
  noToday: 0,
  conditionLast: 1,
  completedLast: 2,
};

const getLabel = (status: number) => {
  switch (status) {
    case STATUS.noToday: return 'На текущий день проверка не создана';
    case STATUS.conditionLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_PGM_BASE_CONDITING];
    case STATUS.completedLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_PGM_BASE_COMPLETED];
  }
};

const InspectionPgmBaseDataActionMenu: React.FC<InspectionPgmBaseDataActionMenuProps> = (props) => {
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
            status === STATUS.noToday && !lastConductingInspect && !lastCompletedInspect
              ? (
                <LineData>
                  <ButtonCreateInspectPgmBase
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
                    <ButtonContinueInspectPgmBase />
                    <ButtonCloseInspectPgmBase />
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

export default compose<InspectionPgmBaseDataActionMenuProps, InspectionPgmBaseDataActionMenuOwnProps>(
  connect<InspectionPgmBaseDataActionMenuStateProps, DispatchProp, InspectionPgmBaseDataActionMenuOwnProps, any, ReduxState>(
    (state) => ({
      lastConductingInspect: getInspectPgmBase(state).lastConductingInspect,
      lastCompletedInspect: getInspectPgmBase(state).lastCompletedInspect,
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
)(InspectionPgmBaseDataActionMenu);

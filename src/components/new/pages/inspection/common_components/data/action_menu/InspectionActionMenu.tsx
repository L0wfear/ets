import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { Row, Col } from 'react-bootstrap';
import { getDateWithMoscowTz, makeDate, makeTime } from 'utils/dates';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { DispatchProp, connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { DivNone } from 'global-styled/global-styled';
import ButtonCloseInspectAutobase from './components/button_inspect_autobase/ButtonCloseInspectAutobase';
import { get } from 'lodash';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { LineData, StatusLabel, LineDataButtonLine, InspectInfo } from './styled/InspectionAutobaseDataActionMenu';
import ButtonContinueInspectAutobase from './components/button_inspect_autobase/ButtonContinueInspectAutobase';
import ButtonCreateInspectAutobase from './components/button_inspect_autobase/ButtonCreateInspectAutobase';
import { TypeOfInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import useLastInpectSatus, { INSPECT_STATUS } from './useLastInpectSatus';
import { getLastConductingInspect, getLastCompletedInspect } from '../../../autobase/@selectors';

type InspectionActionMenuMenuStateProps = {
  lastConductingInspect: InspectAutobase;
  lastCompletedInspect: InspectAutobase;
};

type InspectionActionMenuMenuDispatchProps = DispatchProp;
type InspectionActionMenuMenuOwnProps = {
  loadingPage: string;
  type: TypeOfInspect;
  loadRegistryData: () => Promise<void>;
  makePayloadToCreateInspect?: (searchState: object) => object;
  triggerKey: string;

  LineDataCarsLast?: React.ReactNode;
};

type InspectionActionMenuMenuProps = (
  InspectionActionMenuMenuStateProps
  & InspectionActionMenuMenuDispatchProps
  & InspectionActionMenuMenuOwnProps
);

const InspectionActionMenuMenu: React.FC<InspectionActionMenuMenuProps> = (props) => {
  const {
    lastConductingInspect,
    lastCompletedInspect,
  } = props;

  const {
    status,
    status_text,
  } = useLastInpectSatus(
    lastConductingInspect,
    lastCompletedInspect,
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
            Статус проверки: <StatusLabel>{status_text}</StatusLabel>
          </LineData>
          <LineData>
            &nbsp;
          </LineData>
          {
            status === INSPECT_STATUS.noToday
              ? (
                <LineData>
                  <ButtonCreateInspectAutobase
                    loadRegistryData={props.loadRegistryData}
                    loadingPage={props.loadingPage}
                    type={props.type}
                    triggerKey={props.triggerKey}
                    makePayloadToCreateInspect={props.makePayloadToCreateInspect}
                  />
                </LineData>
              )
              : (
                <DivNone />
              )
          }
          {
            status === INSPECT_STATUS.conditionLast
              ? (
                <>
                  <LineData>
                    <div>
                      <span>Проверка открыта: </span><StatusLabel>{makeDate(get(lastConductingInspect, 'date_start', null))}</StatusLabel>
                    </div>
                    <div>
                      <span>пользователем: </span><StatusLabel>{get(lastConductingInspect, 'open_employee_fio', '')}</StatusLabel>
                    </div>
                  </LineData>
                  {
                    props.LineDataCarsLast
                      ? (
                        props.LineDataCarsLast
                      )
                      : (
                        <DivNone />
                      )
                  }
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
            status === INSPECT_STATUS.completedLast
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

export default compose<InspectionActionMenuMenuProps, InspectionActionMenuMenuOwnProps>(
  connect<InspectionActionMenuMenuStateProps, DispatchProp, InspectionActionMenuMenuOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)),
      lastCompletedInspect: getLastCompletedInspect(getListData(getRegistryState(state), loadingPage)),
    }),
  ),
)(InspectionActionMenuMenu);

import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { makeDate, makeTime, getDateWithMoscowTzByTimestamp } from 'components/@next/@utils/dates/dates';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { DispatchProp, connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { DivNone } from 'global-styled/global-styled';
import { get } from 'lodash';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { LineData, StatusLabel, LineDataButtonLine, InspectInfo } from './styled/InspectionAutobaseDataActionMenu';
import ButtonContinueInspectAutobase from './components/button_inspect_autobase/ButtonContinueInspectAutobase';
import ButtonCreateInspectAutobase from './components/button_inspect_autobase/ButtonCreateInspectAutobase';
import { TypeOfInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import useLastInpectSatus, { INSPECT_STATUS } from './useLastInpectSatus';
import { getLastConductingInspect, getLastCompletedInspect } from '../../../autobase/@selectors';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

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
  const [currentDate, setCurrentDate] = React.useState(null);
  const {
    lastConductingInspect,
    lastCompletedInspect,
  } = props;

  const dispatch = etsUseDispatch();

  const {
    status,
    status_text,
  } = useLastInpectSatus(
    lastConductingInspect,
    lastCompletedInspect,
  );

  React.useEffect(
    () => {
      const loadDate = async () => {
        const {
          date,
        } = await dispatch(
          actionLoadTimeMoscow(
            {},
            {
              page: props.loadingPage,
            },
          ),
        );

        setCurrentDate(
          getDateWithMoscowTzByTimestamp(date),
        );
      };

      loadDate();

      const itervalId = setInterval(
        () => {
          loadDate();
        },
        60 * 1000,
      );

      return () => clearInterval(itervalId);
    },
    [],
  );

  return (
    <BoxContainer>
      <h4>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6} sm={6}>
            Информация о текущей проверке
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6} sm={6}>
            {
              currentDate
                ? (
                  makeDate(currentDate)
                )
                : (
                  '-'
                )
            }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </h4>
      <EtsBootstrap.Row>
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
      </EtsBootstrap.Row>
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

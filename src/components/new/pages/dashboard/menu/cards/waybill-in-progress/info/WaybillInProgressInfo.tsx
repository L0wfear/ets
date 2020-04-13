import * as React from 'react';
import { groupBy } from 'lodash';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';
import {
  dashboardLoadDependentDataByWaybillInProgress,
  dashboardSetInfoDataInWaybillInProgress,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { makeDate } from 'components/@next/@utils/dates/dates';
import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';
import { TitleWaybillInfoContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';

import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const WaybillFormWrap: any = WaybillFormWrapTSX;

type Props = {};

const WaybillInProgressInfo: React.FC<Props> = React.memo(
  () => {
    const [waybillElement, setWaybillElement] = React.useState(null);
    const dispatch = etsUseDispatch();
    const infoData = etsUseSelector((state) => getDashboardState(state).waybill_in_progress.infoData);

    const openWaybillFormWrap = React.useCallback(
      ({
        currentTarget: {
          dataset: { path },
        },
      }) => {
        dispatch(
          actionGetWaybillById(
            Number.parseInt(path, 0),
            { page: 'dashboard' },
          ),
        ).then((waybill_data) => {
          if (waybill_data) {
            setWaybillElement(waybill_data);
          } else {
            // tslint:disable-next-line
            console.warn('not find waybill');
          }
        });
      },
      [],
    );

    const handleWaybillFormWrapHideAfterSubmit = React.useCallback(
      () => {
        dispatch(
          dashboardLoadDependentDataByWaybillInProgress(),
        );
        setWaybillElement(null);
      },
      [],
    );
    const handleClose = React.useCallback(
      () => {
        dispatch(
          dashboardSetInfoDataInWaybillInProgress(null),
        );
      },
      [],
    );

    const infoDataGroupByDate = React.useMemo(
      () => {
        if (infoData) {
          return Object.entries(
            groupBy(
              infoData.subItems,
              (waybill) => makeDate(waybill.date_create),
            ),
          );
        }

        return [];
      },
      [infoData],
    );

    return (
      <InfoCard title="Информация о ПЛ (всего)" handleClose={handleClose}>
        {
          infoDataGroupByDate
            .map(([key, arrData]) => (
              <div key={key}>
                <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
                <div>
                  <ul>
                    {
                      arrData.map(({ id, ...data }) => (
                        <li
                          key={id}
                          className="pointer"
                          data-path={id}
                          onClick={openWaybillFormWrap}>
                          {`№${data.number}, `}
                          <b>{data.gov_number}</b>, {data.garage_number || '-'}
                          <br />
                          {`${data.driver_fio || ''}${
                            data.driver_phone ? `, ${data.driver_phone}` : ''
                          }`}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            ))
        }
        {
          Boolean(waybillElement)
            && (
              <WaybillFormWrap
                onFormHide={handleWaybillFormWrapHideAfterSubmit}
                onCallback={handleWaybillFormWrapHideAfterSubmit}
                element={waybillElement}
              />
            )
        }
      </InfoCard>
    );
  },
);

export default withShowByProps<Props>({
  path: ['dashboard', 'waybill_in_progress', 'infoData'],
  type: 'none',
})(WaybillInProgressInfo);

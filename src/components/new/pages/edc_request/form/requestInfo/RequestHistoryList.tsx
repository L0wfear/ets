import * as React from 'react';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

import {
  registryKey,
} from 'components/new/pages/administration/services/form/service_history/_config-data/registry-config';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { HandleThunkActionCreator } from "react-redux";
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { get } from 'lodash';
import { compose } from 'recompose';
// import DataTable from 'components/ui/tableNew/DataTable';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import TableExample from './table/TableExample';
import TempForm from './table/TempForm';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.

export type RequestHistoryListStateProps = {
  edcRequestInfoList: IStateSomeUniq['edcRequestInfoList'];
};
export type RequestHistoryListDispatchProps = {
  actionGetAndSetInStoreEdcRequestInfo: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreEdcRequestInfo>;
};
export type RequestHistoryListOwnProps = {
  requestElement: EdcRequest;
  page: string;
};
export type RequestHistoryListMergedProps = (
  RequestHistoryListStateProps
  & RequestHistoryListDispatchProps
  & RequestHistoryListOwnProps
) & WithSearchProps;
export type RequestHistoryListProps = (
  RequestHistoryListMergedProps
);

export const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Задание/Наряд-задание',
      type: 'string',
      filter: false,
    },
    {
      name: 'current_percentage',
      displayName: 'Процент выполнения (%)',
      type: 'number',
      filter: false,
    },
    {
      name: 'time_by_objects',
      displayName: 'Время нахождения на объекте, ч.мин',
      type: 'string',
      filter: false,
    },
  ],
};

// const renderers: any = {
//   technical_operation_name: ({ rowData }) =>
//     <div>
//       {
//         `
//           № ${get(rowData, 'number', '-')}
//           (${
//             get(rowData, 'technical_operation_name', '-')
//           })
//         `
//       }
//     </div>,
//   current_percentage: ({ rowData }) =>
//     <div>
//       {
//         get(rowData, 'current_percentage', '-')
//       }
//     </div>,
// };

const RequestHistoryList: React.FC<RequestHistoryListProps> = React.memo(
  (props) => {
    const request_id = get(props, 'requestElement.id', null);

    React.useEffect( () => {
      props.actionGetAndSetInStoreEdcRequestInfo({
        id: request_id,
        original: true,
      }, {page: props.page });
    }, []);

    return (
      <React.Fragment>
        {
          props.edcRequestInfoList.map(
            (rowData, index) => (
              <TableExample key={index + 1} edcRequestInfo={rowData} index={index} />
            ),
          )
        }
        <TempForm edcRequestInfoList={props.edcRequestInfoList} />
      </React.Fragment>
    );
  },
);

export default compose<RequestHistoryListProps, RequestHistoryListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<RequestHistoryListStateProps, RequestHistoryListDispatchProps, RequestHistoryListOwnProps, ReduxState>(
    (state) => ({
      edcRequestInfoList: getSomeUniqState(state).edcRequestInfoList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreEdcRequestInfo: (...args) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreEdcRequestInfo(...args),
        )
      ),
    }),
  ),
  withSearch,
)(RequestHistoryList);

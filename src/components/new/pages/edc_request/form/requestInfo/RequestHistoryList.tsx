import * as React from 'react';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

import { HandleThunkActionCreator } from "react-redux";
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { get } from 'lodash';
import { compose } from 'recompose';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import TableMissionsRequest from './table/TableMissionsRequest';
import RequestMissionsForm from './table/RequestMissionsForm';

import {
  RequestHistoryListWrapper,
  RequestHistoryListRegistry,
} from 'components/new/pages/edc_request/form/requestInfo/styled/styled';

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
        <RequestHistoryListWrapper>
          {
            props.edcRequestInfoList.map(
              (rowData, index) => (
                <RequestHistoryListRegistry key={ `RequestHistoryListRegistry_${index}`}>
                  <TableMissionsRequest
                    key={index + 1}
                    edcRequestInfo={rowData}
                    index={index}
                  />
                </RequestHistoryListRegistry>
              ),
            )
          }
        </RequestHistoryListWrapper>
        <RequestMissionsForm edcRequestInfoList={props.edcRequestInfoList} />
      </React.Fragment>
    );
  },
);

export default compose<RequestHistoryListProps, RequestHistoryListOwnProps>(
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

import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { get } from 'lodash';
import {
  RequestHistoryListWrapper,
  RequestHistoryListRegistry,
} from 'components/new/pages/edc_request/form/requestInfo/styled/styled';
import TableMissionsRequest from 'components/new/pages/edc_request/form/requestInfo/table/TableMissionsRequest';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { HandleThunkActionCreator } from "react-redux";

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

import {
  getConfig,
} from 'components/new/pages/edc_request/form/changeStatusRequesForm/_config-data/registry-config';
import edcRequestActions from 'redux-main/reducers/modules/edc_request/edc_request_actions';

type ChangeStatusRequesFormOwnProps = {
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
  element: any; // <<< заменить

  page: string;
  path?: string;
};

type ChangeStatusRequesFormStateProps = {
  edcRequestInfoList: IStateSomeUniq['edcRequestInfoList'];
};

type ChangeStatusRequesFormDispatchProps = {
  actionGetAndSetInStoreEdcRequestInfo: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreEdcRequestInfo>;
  actionResetEdcRequestInfo: HandleThunkActionCreator<typeof someUniqActions.actionResetEdcRequestInfo>;
  actionCloseEdcRequestById: HandleThunkActionCreator<typeof edcRequestActions.actionCloseEdcRequestById>;
};

type ChangeStatusRequesFormProps = (
  ChangeStatusRequesFormOwnProps
  & ChangeStatusRequesFormStateProps
  & ChangeStatusRequesFormDispatchProps
);

const ChangeStatusRequesForm: React.FC<ChangeStatusRequesFormProps> = React.memo(
  (props) => {
    const request_id = get(props, 'element.request_id', '');
    const request_number = get(props, 'element.request_number', '');

    React.useEffect(
      () => {
        if (request_id) {
          props.actionGetAndSetInStoreEdcRequestInfo(
            {
              id: request_id,
              original: false,
            },
            { page: props.page, path: props.path },
          );
        }
        return () => props.actionResetEdcRequestInfo();
      },
      [request_id],
    );

    // тут делать запрос на бек для изменения статуса заявки
    const setStatusResolve = React.useCallback(
      async () => {
        if (request_id) {
          try {
            await props.actionCloseEdcRequestById(
              request_id,
              { page: props.page },
            );
            props.onFormHide(true);
          } catch (error) {
            console.error(error); // tslint:disable-line
            return;
          }
        }
      },
      [request_id],
    );

    const titleModal = `Заявка ЕДЦ №${request_number}`;
    const edcRequestInfoListItem = get(props, 'edcRequestInfoList.0', null); // !!!!Пустой!!!
    const registryKeyIndex = 'lastRequestMissionInfo';
    // console.log('ChangeStatusRequesForm___ props', props);

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.onFormHide}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{titleModal}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <h4>Все прикрепленные задания ЕДЦ №{request_number}</h4>
          <RequestHistoryListWrapper>
            <RequestHistoryListRegistry>
              <TableMissionsRequest
                edcRequestInfo={edcRequestInfoListItem}
                index={0}
                getConfig={getConfig}
                registryKeyIndex={registryKeyIndex}
              />
            </RequestHistoryListRegistry>
          </RequestHistoryListWrapper>
          Все децентрализованные задания по заявке ЕДЦ №{request_number} закрыты.
          Установить заявке статус "Решена" или оставить в статусе "В работе"?
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={setStatusResolve}>Установить статус "Решена"</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.onFormHide}>Оставить в статусе "В работе"</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<ChangeStatusRequesFormProps, ChangeStatusRequesFormOwnProps>(
  connect<ChangeStatusRequesFormStateProps, ChangeStatusRequesFormDispatchProps, ChangeStatusRequesFormOwnProps, ReduxState>(
    (state) => ({
      edcRequestInfoList: getSomeUniqState(state).edcRequestInfoList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreEdcRequestInfo: (...args) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreEdcRequestInfo(...args),
        )
      ),
      actionResetEdcRequestInfo: (...args) => (
        dispatch(
          someUniqActions.actionResetEdcRequestInfo(...args),
        )
      ),
      actionCloseEdcRequestById: (...arg) => (
        dispatch(
          edcRequestActions.actionCloseEdcRequestById(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(ChangeStatusRequesForm);

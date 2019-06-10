import * as React from 'react';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';
import useEdcRequestCommentsList from 'components/new/utils/hooks/services/useList/useEdcRequestCommentsList';
import BlockCommentData from './blocks/commet/BlockCommentData';

type EdcRequestCommentsProps = {
  element: Partial<EdcRequest>;
  handleHide: (...arg: any[]) => any;

  page: string;
  path: string;
};

const EdcRequestComments: React.FC<EdcRequestCommentsProps> = (props) => {
  const {
    page,
    path,
  } = props;

  const edcRequestComments = useEdcRequestCommentsList(props.element.id);

  return (
    <EtsBootstrap.ModalContainer
      id="modal-edc_request_cancel-mission"
      show
      onHide={props.handleHide}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>Комментарии</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {
              edcRequestComments.isLoading ? (
                <PreloadNew typePreloader="field" />
              )
              : (
                !edcRequestComments.list.length
                  ? (
                    <h4>Отсутствуют</h4>
                  )
                  : (
                    edcRequestComments.list.map(
                      (rowData, index) => (
                        <BlockCommentData
                          key={index + 1}
                          date={rowData.date}
                          fio={rowData.user_fio}
                          comment={rowData.comment}
                        />
                      ),
                    )
                  )
              )
            }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button onClick={props.handleHide} >
          Закрыть
        </EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default EdcRequestComments;

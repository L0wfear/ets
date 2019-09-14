import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

const EdcRequestCancel = React.lazy(() =>
  import(/* webpackChunkName: "edc_request_comments_form" */ 'components/new/pages/edc_request/form/comments/EdcRequestComments'),
);

type EdcRequestCommentsLazyProps = {
  showForm: boolean;
  element: Pick<EdcRequest, 'id'> & Partial<EdcRequest>;
  onFormHide: (...arg: any[]) => any;

  page: string;
  path: string;
};

const EdcRequestCommentsLazy: React.FC<EdcRequestCommentsLazyProps> = React.memo(
  (props) => {
    const path = `${props.path ? `${props.path}-` : ''}-comments-form`;

    return Boolean(props.showForm) && (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <EdcRequestCancel
            element={props.element}
            handleHide={props.onFormHide}

            page={props.page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default EdcRequestCommentsLazy;

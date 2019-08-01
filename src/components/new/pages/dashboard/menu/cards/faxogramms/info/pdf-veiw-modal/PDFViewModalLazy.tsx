import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import {
  PropsPDFViewModal,
} from 'components/new/pages/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal.h';

const PDFViewModal = React.lazy(() => (
  import(/* webpackChunkName: "pdf_view_modal" */ 'components/new/pages/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal')
));

class MissionFormLazy extends React.PureComponent<PropsPDFViewModal & { show: boolean }, {}> {
  render() {
    const {
      show,
      ...props
    } = this.props;

    return (
      this.props.show ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <PDFViewModal
              {...props}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      ( <DivNone /> )
    );
  }
}

export default MissionFormLazy;

import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import {
  PropsPDFViewModal,
} from 'components/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal.h';



const PDFViewModal = React.lazy(() => (
  import(/* webpackChunkName: "pdf_view_modal" */'components/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal')
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
        <React.Suspense fallback={<LoadingComponent />}>
          <PDFViewModal
            {...props}
          />
        </React.Suspense>
      )
      :
      ( <DivNone /> )
    )
  }
}

export default MissionFormLazy;

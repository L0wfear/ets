import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import { PropsSparePartFormWrap } from 'components/directories/autobase/spare_part/SparePartForm/@types/SparePart.h';

const SparePartFrom = React.lazy(() => (
  import(/* webpackChunkName: "spare_part_form" */'components/directories/autobase/spare_part/SparePartForm/SparePartForm')
));

class SparePartFormWrap extends React.Component<PropsSparePartFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}spare-part-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <SparePartFrom
            element={props.element}
            handleHide={props.onFormHide}

            page={page}
            path={path}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  }
}

export default SparePartFormWrap;

import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsMaintenanceRateFormLazy } from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/@types/MaintenanceRateForm';
import { compose } from 'recompose';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { connect } from 'react-redux';
import { getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { get } from 'lodash';

const MaintenanceRateForm = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate_form" */'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/MaintenanceRateForm')
));

const MaintenanceRateFormLazy: React.FC<PropsMaintenanceRateFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}maintenance-rate-form`;

    return props.element ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <MaintenanceRateForm
            element={props.element}
            handleHide={props.onFormHide}

            type={props.type}
            page={page}
            path={path}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  },
);

export default compose<any, any>(
  withFormRegistrySearch({}),
  connect<any, any, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      type: get(getServiceData(getRegistryState(state), registryKey), 'getRegistryData.payload.type', null),
    }),
  ),
)(MaintenanceRateFormLazy);

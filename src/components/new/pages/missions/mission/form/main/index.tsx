import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { WithFormRegistrySearchAddPropsWithoutWithSerach } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { MissionFormReactLazy } from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';

type OwnProps = WithFormRegistrySearchAddPropsWithoutWithSerach<Partial<Mission>> & {
  showForm: boolean;
  notChangeCar?: boolean;
};
type Props = OwnProps & WithSearchProps;

const MissionFormWithoutRegistry: React.FC<Props> = React.memo(
  ({ showForm, ...props }) => {
    return showForm && (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <MissionFormReactLazy
            {...props}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default withSearch<OwnProps>(MissionFormWithoutRegistry);

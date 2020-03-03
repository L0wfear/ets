import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DutyMissionFormContextLazyReact } from 'components/new/pages/missions/duty_mission/form/main/DutyMissionListFormWrap';
import { WithFormRegistrySearchAddPropsWithoutWithSerach } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

type OwnProps = WithFormRegistrySearchAddPropsWithoutWithSerach<Partial<DutyMission>> & {
  showForm: boolean;
  readOnly?: boolean;
};
type Props = OwnProps & WithSearchProps;

const DutyMissionFormWithoutRegistry: React.FC<Props> = React.memo(
  ({ showForm, ...props }) => {
    const element = React.useMemo(
      () => {
        return props.element || {};
      },
      [props.element],
    );

    return showForm && (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <DutyMissionFormContextLazyReact
            {...props}
            element={element}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default withSearch<OwnProps>(DutyMissionFormWithoutRegistry);

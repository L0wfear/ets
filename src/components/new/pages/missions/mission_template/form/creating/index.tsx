import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsMissionTemplateCreatingFormLazy } from './@types/MissionTemplateCreatingForm';

const MissionTemplateCreatingForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_template_creating_form" */ 'components/new/pages/missions/mission_template/form/creating/MissionTemplateCreatingForm'),
);

// Ленивая загрузка шаблона наряд-задания
const MissionTemplateCreatingFormLazy: React.FC<PropsMissionTemplateCreatingFormLazy> = React.memo(
  (props) => {
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}mission_template_creating_form`;

    const element = React.useMemo(
      () => {
        return {
          missionTemplates: props.missionTemplates,
        };
      },
      [props.missionTemplates],
    );

    return props.showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <MissionTemplateCreatingForm
            element={element}
            handleHide={props.onFormHide}

            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    ) : (
      <DivNone />
    );
  },
);

export default MissionTemplateCreatingFormLazy;

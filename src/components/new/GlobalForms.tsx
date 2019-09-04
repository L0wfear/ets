import * as React from 'react';

import ShowActsFormLazy from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/ShowActsFormLazy';

// Здесь формы, которые можно открыть по урлу
const GlobalForms: React.FC<{}> = React.memo(
  (props) => {

    return (
      <React.Fragment>
        <ShowActsFormLazy />
      </React.Fragment>
    );
  },
);

export default GlobalForms;

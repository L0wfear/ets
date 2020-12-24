import * as React from 'react';

import RefillExportForm from './print_form';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type Props = CommonTypesForButton & {};

const ButtonRefillExport: React.FC<Props> = (props) => {
  const [showForm, setShowForm] = React.useState(false);

  const handleHide = React.useCallback(
    () => {
      setShowForm(false);
    },
    [],
  );

  const showPrintForm = React.useCallback(
    () => {
      setShowForm(true);
    },
    [],
  );

  return (
    <>
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={showPrintForm}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
      {
        showForm && (
          <RefillExportForm
            showForm={showForm}
            handleHide={handleHide}
            registryKey={props.registryKey}
          />
        )
      }
    </>
  );
};

export default ButtonRefillExport;

import * as React from 'react';
import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = CommonTypesForButton & {};

const ButtonExportFiltredData: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      () => {
        dispatch(
          registyLoadPrintForm(props.registryKey, true),
        );
      },
      [props.registryKey],
    );
    return (
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClick}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
    );
  },
);

export default ButtonExportFiltredData;

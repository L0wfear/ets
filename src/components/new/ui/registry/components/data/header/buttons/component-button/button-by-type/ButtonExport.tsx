import * as React from 'react';

import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type PropsButtonExport = CommonTypesForButton & {};

const ButtonExport: React.FC<PropsButtonExport> = React.memo(
  (props) => {
    const { data } = props;
    const dispatch = etsUseDispatch();
    const handleClick = React.useCallback(
      () => (
        dispatch(
          registyLoadPrintForm(props.registryKey),
        )
      ),
      [props.registryKey],
    );

    const glyph = React.useMemo(
      () => (
        data && data.glyph
      ),
      [props.data],
    );

    return (
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClick}
      >
        <EtsBootstrap.Glyphicon glyph={glyph || 'download-alt'} />
      </EtsBootstrap.Button>
    );
  },
);

export default ButtonExport;

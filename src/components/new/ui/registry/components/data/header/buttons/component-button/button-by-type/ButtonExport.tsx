import * as React from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';

import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

type PropsButtonExport = {
  data?: ValuesOf<OneRegistryData['header']['buttons']>
  registryKey: string;
};

const ButtonExport: React.FC<PropsButtonExport> = React.memo(
  (props) => {
    const dispatch = useDispatch();
    const handleClick = React.useCallback(
      () => (
        dispatch(
          registyLoadPrintForm(props.registryKey),
        )
      ),
      [props.registryKey],
    );

    const data = React.useMemo(
      () => (
        get(props, 'data', {} as PropsButtonExport['data'])
      ),
      [props.data],
    );

    return (
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClick}
      >
        <EtsBootstrap.Glyphicon glyph={data.glyph || 'download-alt'} />
      </EtsBootstrap.Button>
    );
  },
);

export default ButtonExport;

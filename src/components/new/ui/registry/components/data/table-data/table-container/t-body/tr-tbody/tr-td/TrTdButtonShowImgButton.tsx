import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ImgListPortal from 'components/new/ui/portals/img_list_portal/ImgListPortal';

type TrTdButtonShowImgButtonProps = {
  registryKey: string;
  rowData: { files?: any[] } & Record<string, any>;
};

const TrTdButtonShowImgButton: React.FC<TrTdButtonShowImgButtonProps> = React.memo(
  (props) => {
    const [showImage, setShowImage] = React.useState(false);

    const { rowData } = props;

    const files = React.useMemo(
      () => {
        if (rowData.files) {
          return rowData.files.map(
            (rowDataFile: any) => ({
              ...rowDataFile,
              url: rowDataFile.path,
            }),
          );
        }

        return null;
      },
      [rowData.files],
    );

    const handleClick = React.useCallback(
      () => {
        setShowImage(true);
      },
      [files],
    );

    const handleClose = React.useCallback(
      () => {
        setShowImage(false);
      },
      [],
    );

    return (
      <EtsTbodyTrTd>
        {
          Boolean(files)
            ? (
              <EtsBootstrap.Button block onClick={handleClick}>Просмотр</EtsBootstrap.Button>
            )
            : (
              '-'
            )
        }
        {
          showImage && (
            <ImgListPortal
              images={files}
              onClose={handleClose}
            />
          )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default TrTdButtonShowImgButton;

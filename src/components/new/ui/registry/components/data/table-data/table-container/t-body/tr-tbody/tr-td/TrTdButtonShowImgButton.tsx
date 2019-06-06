import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

import ImgListPortal from 'components/new/ui/portals/img_list_portal/ImgListPortal';
import SimpleLinkA from 'components/new/ui/simple_a/link';
import { saveData, isImgPath } from 'utils/functions';

type TrTdButtonShowImgButtonProps = {
  registryKey: string;
  rowData: { files?: any[] } & Record<string, any>;
};

const TrTdButtonShowImgButton: React.FC<TrTdButtonShowImgButtonProps> = React.memo(
  (props) => {
    const [filesToShow, setShowImage] = React.useState(
      () => ({
        images: null,
        index: 0,
      }),
    );

    const { rowData } = props;

    const files = React.useMemo(
      () => {
        if (rowData.files && rowData.files.length) {
          return rowData.files.map(
            (rowDataFile) => ({
              ...rowDataFile,
              name: rowDataFile.filename,
            }),
          );
        }

        return null;
      },
      [rowData.files],
    );

    const handleClick = React.useCallback(
      (aProps: any, event: React.MouseEvent) => {
        const { file } = aProps;

        if (isImgPath(file.path)) {
          const filesImg = files.filter(({ path }) => isImgPath(path));
          setShowImage({
            images: filesImg,
            index: filesImg.findIndex(({ path }) => file.path === path),
          });
        } else {
          fetch(aProps.file.path)
            .then((res) => res.blob())
            .then((blob) => saveData(blob, aProps.file.filename));
        }
      },
      [files],
    );

    const handleClose = React.useCallback(
      () => {
        setShowImage({
          images: null,
          index: 0,
        });
      },
      [],
    );

    return (
      <EtsTbodyTrTd>
        {
          Boolean(files)
            ? (
              <React.Fragment>
                {
                  files.map((file, index) => (
                    <li key={file.path}>
                      <SimpleLinkA onClick={handleClick} index={index} file={file}>{file.filename}</SimpleLinkA>
                    </li>
                  ))
                }
              </React.Fragment>
            )
            : (
              '-'
            )
        }
        {
          filesToShow.images && (
            <ImgListPortal
              images={filesToShow.images}
              indexToShow={filesToShow.index}
              onClose={handleClose}
            />
          )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default TrTdButtonShowImgButton;

import * as React from 'react';

import ImgListPortal from 'components/new/ui/portals/img_list_portal/ImgListPortal';
import SimpleLinkA from 'components/new/ui/simple_a/link';
import { isImgPath } from 'utils/functions';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';

export const FileListLiStyled = styled.div`
  margin-bottom: 5px;
  text-decoration: none!important;
  text-decoration-style: none!important;
`;

type Props = CommontTdTiteProps;

const ShowFileListTdTitle: React.FC<Props> = React.memo(
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
          event.preventDefault();
          const filesImg = files.filter(({ path }) => isImgPath(path));
          setShowImage({
            images: filesImg,
            index: filesImg.findIndex(({ path }) => file.path === path),
          });
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
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        {
          Boolean(files)
            ? (
              <React.Fragment>
                {
                  files.map((file, index) => (
                    <FileListLiStyled key={file.path}>
                      <SimpleLinkA shortTitle={true} withFileFormatLabel={true} onClick={handleClick} href={file.path} index={index} file={file} title={file.filename} target="_blanc">{file.filename}</SimpleLinkA>
                    </FileListLiStyled>
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
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default ShowFileListTdTitle;

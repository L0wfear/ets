import * as React from 'react';

import SimpleLinkA from 'components/new/ui/simple_a/link';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';

export const FileLiStyled = styled.div`
  margin-bottom: 5px;
  text-decoration: none!important;
  text-decoration-style: none!important;
`;

type Props = CommontTdTiteProps;

const ShowFileTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;

    const files = React.useMemo(
      () => {
        if (rowData.files && rowData.files.length) {
          return rowData.files.map(
            (rowDataFile) => ({
              ...rowDataFile,
              name: rowDataFile.name,
            }),
          );
        }

        return null;
      },
      [rowData.files],
    );

    const handleClick = React.useCallback(
      (aProps) => {
        const { pdf } = aProps;

        let iframe = `<iframe width='100%' height='100%' src='${pdf.url}'></iframe>`;
        const w = window.open('');
        w.document.write(iframe);
        w.document.close();
      },
      [files],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        {
          Boolean(files)
            ? (
              <React.Fragment>
                {
                  files.map((file, index) => (
                    <FileLiStyled key={file.path}>
                      <SimpleLinkA shortTitle={true} withFileFormatLabel={true} onClick={handleClick} href={file.path} index={index} file={file} title={file.name} target="_blank">{file.name}</SimpleLinkA>
                    </FileLiStyled>
                  ))
                }
              </React.Fragment>
            )
            : (
              '-'
            )
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default ShowFileTdTitle;

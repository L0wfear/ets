import * as React from 'react';
import { FileField } from 'components/ui/input/fields';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

type BlockInspectAutobaseDataFilesProps = {
  isPermittedChangeListParams: boolean;
} & (
  {
    files: InspectAutobase['files'];

    onChange: (obj: Partial<InspectAutobase>) => any;
  } | {
    files: InspectPgmBase['files'];

    onChange: (obj: Partial<InspectPgmBase>) => any;
  }
);

const BlockInspectAutobaseDataFiles: React.FC<BlockInspectAutobaseDataFilesProps> = React.memo(
  (props) => {
    const {
      files,
      isPermittedChangeListParams,

    } = props;

    const onChangeDataFile = React.useCallback(
      (key, filesByKey) => {
        props.onChange({
          files: [
            ...files.filter(({ kind }) => kind !== key),
            ...filesByKey.map(
              (rowData) => ({
                ...rowData,
                kind: key,
              }),
            ),
          ],
        });
      },
      [props.onChange, files],
    );

    const valuePhotosOfSupportingDocuments = React.useMemo(
      () => {
        return files.filter(({ kind }) => kind === 'photos_of_supporting_documents');
      },
      [files],
    );

    const valuePhotosDefect = React.useMemo(
      () => {
        return files.filter(({ kind }) => kind === 'photos_defect');
      },
      [files],
    );

    return (
      <EtsBootstrap.Row>
        {
          Boolean(isPermittedChangeListParams || valuePhotosOfSupportingDocuments.length) && (
            <EtsBootstrap.Col md={6}>
              <FileField
                id="file"
                label="Фотографии подтверждающих документов"
                multiple
                value={valuePhotosOfSupportingDocuments}
                onChange={onChangeDataFile}
                disabled={!isPermittedChangeListParams}
                boundKeys="photos_of_supporting_documents"
              />
            </EtsBootstrap.Col>
          )
        }
        {
          Boolean(isPermittedChangeListParams || valuePhotosDefect.length) && (
            <EtsBootstrap.Col md={6}>
              <FileField
                id="file"
                label="Фотографии дефектов"
                multiple
                value={valuePhotosDefect}
                onChange={onChangeDataFile}
                disabled={!isPermittedChangeListParams}
                boundKeys="photos_defect"
              />
            </EtsBootstrap.Col>
          )
        }
      </EtsBootstrap.Row>
      );
  },
);

export default BlockInspectAutobaseDataFiles;

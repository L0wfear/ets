import * as React from 'react';
import { FileField } from 'components/old/ui/input/fields';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type BlockDataFilesProps = {
  isPermittedListPhotosOfSupportingDocuments: boolean;
  isPermittedListPhotosDefect: boolean;
  files: any[];
  onChange: (obj: Partial<object>) => any;
};

const BlockDataFiles: React.FC<BlockDataFilesProps> = React.memo(
  (props) => {
    const {
      files,
      isPermittedListPhotosOfSupportingDocuments,
      isPermittedListPhotosDefect,

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
          Boolean(isPermittedListPhotosOfSupportingDocuments || valuePhotosOfSupportingDocuments.length) && (
            <EtsBootstrap.Col md={12}>
              <FileField
                id="file"
                label="Фотографии подтверждающих документов"
                multiple
                value={valuePhotosOfSupportingDocuments}
                onChange={onChangeDataFile}
                disabled={!isPermittedListPhotosOfSupportingDocuments}
                boundKeys="photos_of_supporting_documents"
              />
            </EtsBootstrap.Col>
          )
        }
        {
          Boolean(isPermittedListPhotosDefect || valuePhotosDefect.length) && (
            <EtsBootstrap.Col md={12}>
              <FileField
                id="file"
                label="Фотографии дефектов"
                multiple
                value={valuePhotosDefect}
                onChange={onChangeDataFile}
                disabled={!isPermittedListPhotosDefect}
                boundKeys="photos_defect"
              />
            </EtsBootstrap.Col>
          )
        }
      </EtsBootstrap.Row>
      );
  },
);

export default BlockDataFiles;

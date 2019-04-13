import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { FileField } from 'components/ui/input/fields';

type BlockCarsConditionSelectPhotosOfSupportingDocumentsProps = {
  files: InspectCarsCondition['files'],

  onChange: any;
};

const BlockCarsConditionSelectPhotosOfSupportingDocuments: React.FC<BlockCarsConditionSelectPhotosOfSupportingDocumentsProps> = React.memo(
  (props) => {
    const {
      files,
    } = props;

    const value = React.useMemo(
      () => {
        return files.filter(({ kind }) => kind === 'photos_of_supporting_documents');
      },
      [files],
    );

    const handleChange = React.useCallback(
      (newFile) => {
        props.onChange({
          files: [
            ...files.filter(({ kind }) => kind !== 'photos_of_supporting_documents'),
            ...newFile.map((rowData) => {
              return {
                ...rowData,
                kind: 'photos_of_supporting_documents',
              };
            }),
          ],
        });
      },
      [props.onChange, files],
    );
    return (
      <FileField
        id="file_photos_of_supporting_documents"
        label="Фотографии подтверждающих документов"
        multiple
        value={value}
        onChange={handleChange}
      />
    );
  },
);

export default BlockCarsConditionSelectPhotosOfSupportingDocuments;

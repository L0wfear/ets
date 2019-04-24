import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { FileField } from 'components/ui/input/fields';
import { DivNone } from 'global-styled/global-styled';

type BlockCarsConditionSelectPhotosOfSupportingDocumentsProps = {
  files: InspectCarsCondition['files'],
  isActiveInspect: boolean;
  isPermitted: boolean;
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
      props.isActiveInspect || value.length
        ? (
          <FileField
            id="file_photos_of_supporting_documents"
            label="Фотографии подтверждающих документов"
            multiple
            value={value}
            disabled={!props.isPermitted || !props.isActiveInspect}
            onChange={handleChange}
          />
        )
        : (
          <DivNone />
        )
    );
  },
);

export default BlockCarsConditionSelectPhotosOfSupportingDocuments;

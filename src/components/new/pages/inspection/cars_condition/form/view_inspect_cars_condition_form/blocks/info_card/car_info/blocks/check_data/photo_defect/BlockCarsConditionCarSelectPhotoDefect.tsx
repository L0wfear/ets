import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { FileField } from 'components/old/ui/input/fields';
import { BlockCarInfoProps } from '../../../@types/BlockCarInfo';

type BlockCarsConditionCarSelectPhotoDefectProps = {
  files: CarsConditionCars['files'],
  isPermitted: boolean;
  onChange: BlockCarInfoProps['handleChange'];
};

const BlockCarsConditionCarSelectPhotoDefect: React.FC<BlockCarsConditionCarSelectPhotoDefectProps> = React.memo(
  (props) => {
    const {
      files,
    } = props;

    const value = React.useMemo(
      () => {
        return files.filter(({ kind }) => kind === 'photo_defect');
      },
      [files],
    );

    const handleChange = React.useCallback(
      (key, newFile) => {
        props.onChange({
          [key]: [
            ...files.filter(({ kind }) => kind !== 'photo_defect'),
            ...newFile.map((rowData) => {
              return {
                ...rowData,
                kind: 'photo_defect',
              };
            }),
          ],
        });
      },
      [props.onChange, files],
    );

    return (
      <FileField
        id="file_photo_defect"
        label="Фотографии дефектов"
        multiple
        value={value}
        onChange={handleChange}
        disabled={!props.isPermitted}
        boundKeys="files"
      />
    );
  },
);

export default BlockCarsConditionCarSelectPhotoDefect;

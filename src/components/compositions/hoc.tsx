import { withHandlers, compose, withState } from 'recompose';
import { identity } from 'lodash';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { mbToBytes } from 'utils/functions';
import { IFileWrapper } from 'components/ui/input/FileInput/FileInput.h';

export const onChangeWithKeys = withHandlers({
  onChange: ({ onChange, boundKeys = []}) => e => onChange(...boundKeys, e),
});

export const onClickWithKeys = withHandlers({
  onClick: ({ onClick, boundKeys = []}) => e => onClick(...boundKeys, e),
});

export const tabable = compose(
  withState('tabKey', 'setTabKey', ({ defaultTabKey = '1' }) => defaultTabKey),
  withHandlers({ handleTabSelect: ({ setTabKey }) => (key1, key2) => setTabKey(typeof key1 === 'string' ? key1 : key2) })
);

/**
 * Input fields enhacers
 */
export const dateTimeFormatter = withHandlers({
  onChange: ({ time = true, onChange }) => (eventValue) => {
    const validationFunction = time ? createValidDateTime : createValidDate;
    onChange(validationFunction(eventValue));
  },
});

export const multiSelectFormatter = withHandlers({
  onChange: ({ onChange, delimiter = ',', integer = false }) => (eventValue = '') => {
    if (eventValue === '') {
      onChange([]);
      return;
    }

    const itemList = eventValue
      .split(delimiter)
      .map(item => integer ? parseInt(item, 10) : item);
    onChange(itemList);
  },
});

export function fromIterableListToArray<ArrayType = any>(itetableList): ArrayType[] {
  const array: any[] = [];
  for (const item of itetableList) {
    array.push(item);
  }

  return array;
}

export const fileFormatter = withHandlers({
  onChange: ({
    onChange,
    isLoading = identity,
    value = [],
    multiple = false,
  }) => async e => {
    if (Array.isArray(e)) {
      onChange(e);
      return;
    }

    if (e.target.files.length === 0) {
      return;
    }

    const newFiles: File[] = fromIterableListToArray(e.target.files);

    const fileArray: IFileWrapper[] = [];

    newFiles.forEach(file => {
      fileArray.push({
        nativeFile: file,
        name: file.name,
      });
    });

    // base64 getting
    const base64PromiseList = [];

    try {
      fileArray.forEach(fileWrapper => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileWrapper.nativeFile);

        const readingPromise = new Promise(resolve => {
          fileReader.onload = ((event: any) => {
            resolve(event.target.result);
          });
        });

        base64PromiseList.push(readingPromise);
      });
    } catch (error) {
      console.log('File reading error:', error);
    }

    let base64List = [];
    try {
      isLoading(true);
      base64List = await Promise.all(base64PromiseList);
      isLoading(false);
    } catch (error) {
      isLoading(false);
    }

    const fileWrappers = fileArray.map((fileWrapper, i) => ({
      ...fileWrapper,
      base64: base64List[i],
    }));

    if (!multiple) {
      onChange([...fileWrappers]);
      return;
    }

    onChange([...value, ...fileWrappers]);
  },
});

export const MAX_SIZE_PER_FILE_MB = 140;
export const MAX_SUM_FILE_SIZE_MB = 140;
export const MAX_FILE_COUNT = 140;

export const fileCountLimiter = withHandlers({
  onChange: ({
    maxCount = MAX_FILE_COUNT,
    maxSize = mbToBytes(MAX_SUM_FILE_SIZE_MB),
    maxSizePerFile = mbToBytes(MAX_SIZE_PER_FILE_MB),
    onChange,
    value = [],
  }) => e => {
    if (Array.isArray(e)) {
      onChange(e);
      return;
    }

    const newFiles = e.target.files;

    if (newFiles.length === 0) {
      return;
    }

    if (newFiles.length > maxCount) {
      global.NOTIFICATION_SYSTEM.notify(`Максимальное количество файлов для загрузки не должо быть больше ${maxCount}`, 'warning');
      return;
    }

    let sumFileSize = 0;

    for (const file of newFiles) {
      if (file.size > maxSizePerFile) {
        global.NOTIFICATION_SYSTEM.notify(`Максимальный объём отдельно взятого файла для загрузки не должен быть больше ${MAX_SIZE_PER_FILE_MB} Мб`, 'warning');
        return;
      }

      sumFileSize += file.size;
    }

    if (sumFileSize > maxSize) {
      global.NOTIFICATION_SYSTEM.notify(`Максимальный сумарный объём всех файлов для загрузки не должен быть больше ${MAX_SUM_FILE_SIZE_MB} Мб`, 'warning');
      return;
    }

    onChange(e);
  },
});

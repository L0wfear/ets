import { identity } from 'lodash';
import { withHandlers } from 'recompose';

import { mbToBytes, fromIterableListToArray } from 'utils/functions';
import { IFileWrapper } from 'components/old/ui/input/FileInput/FileInput.h';

export const fileFormatter = withHandlers({
  onChange: ({
    onChange,
    isLoading = identity,
    value = [],
    multiple = false,
    kind
  }) => async (boundKeys, e) => {
    if (Array.isArray(e)) {
      onChange(boundKeys, e);
      return;
    }

    const newFiles: Array<File> = fromIterableListToArray(e.target.files);

    const fileArray: Array<IFileWrapper> = [];

    newFiles.forEach((file) => {
      fileArray.push({
        nativeFile: file,
        name: file.name,
        action: 'add',
        kind,
      });
    });

    // base64 getting
    const base64PromiseList = [];

    try {
      fileArray.forEach((fileWrapper) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileWrapper.nativeFile);

        const readingPromise = new Promise((resolve) => {
          fileReader.onload = ((event: any) => {
            resolve(event.target.result);
          });
        });

        base64PromiseList.push(readingPromise);
      });
    } catch (error) {
      console.info('File reading error:', error); // eslint-disable-line
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

    onChange(boundKeys, [...value, ...fileWrappers]);
  },
});

export const MAX_SIZE_PER_FILE_MB = 20;
export const MAX_SUM_FILE_SIZE_MB = 20;
export const MAX_FILE_COUNT = 140;

const getFileSize = (file: IFileWrapper & File) => file.nativeFile
  ? file.nativeFile.size
  : file.size;

export const fileCountLimiter = withHandlers({
  onChange: ({
    maxCount = MAX_FILE_COUNT,
    maxSize = mbToBytes(MAX_SUM_FILE_SIZE_MB),
    onChange,
    value = [],
  }) => (boundKeys, e) => {
    if (Array.isArray(e)) {
      onChange(boundKeys, e);
      return;
    }

    const newFiles: Array<File> = fromIterableListToArray(e.target.files);
    const allFiles = [...value, ...newFiles];

    if (allFiles.length > maxCount) {
      global.NOTIFICATION_SYSTEM.notify(`Максимальное количество файлов для загрузки не должо превышать ${maxCount}`, 'warning');
      return;
    }

    const sumFileSize = newFiles.reduce((prev, curr) => prev + getFileSize(curr), 0);

    if (sumFileSize > maxSize) {
      global.NOTIFICATION_SYSTEM.notify(`Максимальный суммарный объём всех файлов для загрузки не должен превышать ${MAX_SUM_FILE_SIZE_MB} Мб`, 'warning');
      return;
    }

    onChange(boundKeys, e);
  },
});

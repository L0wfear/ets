import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
export type IPropsFileInput = {
  disabled?: boolean;
  value: Array<IFileWrapper>;
  formats?: string;
  multiple?: boolean;
  buttonName?: string;
  errorClassName?: string;
  maxCount?: number;
  maxSize?: number;
  maxSizePerFile?: number;
  showFileList: boolean;
  id?: any;
  button_id?: any;
  modalKey?: string;
  // onChange(e: React.ChangeEvent<HTMLInputElement> | File[] | IFileWrapper[]): void;
  onChange(e: React.ChangeEvent<HTMLInputElement> | Array<File> | Array<IFileWrapper>): void;
  isLoading?(callback: (indicator: boolean, error?: any) => void): void;

  askBefoeRemove?: boolean;
} & (
  | {
    showPrintBtn?: never;
    getFileAction?: never;
    allowedFormats?: never;
    }
  | {
    showPrintBtn: boolean;
    getFileAction: (url: string, meta: LoadingMeta) => EtsAction<Promise<{blob: Blob; fileName: string;}>>;
    allowedFormats: Array<string>;
  }
);

export type IStateFileInput = {
  isFilesLoading: boolean;
};

export type IFileWrapper = {
  nativeFile?: File;
  name: string;
  url?: string;
  base64?: string;
  created_at?: string;
  kind?: string;
  action?: 'add' | 'delete'; // delete для удаления на бэке, такой файл не отображается
};

export interface IPropsFileInput {
  disabled?: boolean;
  value: IFileWrapper[];
  formats?: string;
  multiple?: boolean;
  buttonName?: string;
  errorClassName?: string;
  maxCount?: number;
  maxSize?: number;
  maxSizePerFile?: number;
  showFileList: boolean;

  onChange(e: React.ChangeEvent<HTMLInputElement> | File[] | IFileWrapper[]): void;
  isLoading?(callback: (indicator: boolean, error?: any) => void): void;
}

export interface IStateFileInput {
  isFilesLoading: boolean;
}

export interface IFileWrapper {
  nativeFile?: File;
  name: string;
  url?: string;
  base64?: string;
}

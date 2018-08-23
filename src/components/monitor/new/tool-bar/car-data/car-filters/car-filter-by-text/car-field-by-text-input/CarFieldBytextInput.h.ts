export type PropsCarFieldBytextInput = {
  carFilterText: string;
  canFocusOnCar: boolean;
  changeCarFilterText: React.ChangeEvent<HTMLInputElement>;
  handleFocusOnCar: React.MouseEventHandler<HTMLDivElement>;
}

export type StateCarFieldBytextInput = {};

export module CarFieldBytextInputUtils {
  export type ChangeCarFilterText = React.ChangeEvent<HTMLInputElement>;
  export type HandleFocusOnCar = React.MouseEventHandler<HTMLDivElement>;
}
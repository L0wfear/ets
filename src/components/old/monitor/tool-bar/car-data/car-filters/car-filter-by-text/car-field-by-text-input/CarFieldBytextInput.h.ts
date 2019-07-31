export type PropsCarFieldBytextInput = {
  carFilterText: string;
  canFocusOnCar: boolean;
  changeCarFilterText: any;
  resetCarFilterText: React.MouseEventHandler<any>;
  handleFocusOnCar: React.MouseEventHandler<HTMLDivElement>;
};

export type StateCarFieldBytextInput = {};

export namespace CarFieldBytextInputUtils {
  export type ChangeCarFilterText = React.ChangeEvent<HTMLInputElement>;
  export type HandleFocusOnCar = React.MouseEventHandler<HTMLDivElement>;
}

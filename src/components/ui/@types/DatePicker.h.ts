export interface IPropsDatePicker {
  date?: Date | string;
  onChange?(...any): void;
  time?: boolean;
}

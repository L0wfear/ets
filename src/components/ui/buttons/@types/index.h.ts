export interface ICRUDButton {
  permissions?: string[];
  onClick?(...any): void;
  disabled?: boolean;
}

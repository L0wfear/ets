export type ICRUDButton = {
  permissions?: string;
  onClick?(...any): void;
  disabled?: boolean;
  buttonName: string;
};

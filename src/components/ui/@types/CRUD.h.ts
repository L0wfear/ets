export default interface ICRUD {
  permissions?: string[];
  onClick?(...any): void;
  disabled?: boolean;
}

export type CleanSubcategories = {
  id: number | null;
  name: string | null;
};

export type CleanCategories = {
  id: number | null;
  name: string | null;
  subcategories: Array<CleanSubcategories>;
};

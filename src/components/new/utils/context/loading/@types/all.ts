import { Country } from "redux-main/reducers/modules/some_uniq/country/@types";
import { CarFuncTypes, CarCategory, EngineType } from "redux-main/reducers/modules/autobase/@types/autobase.h";
import { LoadingServiceGeneric } from "./common";

export type CountryApi = LoadingServiceGeneric<'country', object, Country[]>;
export type TypesApi = LoadingServiceGeneric<'types', object, CarFuncTypes[]>;
export type AutobaseCarCategoryApi = LoadingServiceGeneric<'autobase/car_category', object, CarCategory[]>;
export type AutobaseEngineTypeApi = LoadingServiceGeneric<'autobase/engine_type', object, EngineType[]>;

import { Country } from "redux-main/reducers/modules/some_uniq/country/@types";
import { CarFuncTypes, CarCategory, EngineType, Car } from "redux-main/reducers/modules/autobase/@types/autobase.h";
import { LoadingServiceGeneric } from "./common";
import { TimeData } from "./by_service/time";
import { ActualBatteriesOnCar } from "redux-main/reducers/modules/autobase/actions_by_type/actual_batteries_on_car/@types";
import { ActualTiresOnCar } from "redux-main/reducers/modules/autobase/actions_by_type/actual_tires_on_car/@types";

export type CountryApi = LoadingServiceGeneric<'country', object, Country[]>;
export type TypesApi = LoadingServiceGeneric<'types', object, CarFuncTypes[]>;
export type AutobaseCarCategoryApi = LoadingServiceGeneric<'autobase/car_category', object, CarCategory[]>;
export type AutobaseEngineTypeApi = LoadingServiceGeneric<'autobase/engine_type', object, EngineType[]>;
export type TimeApi = LoadingServiceGeneric<'time', object, TimeData>;
export type AutobaseActualBatteriesOnCarApi = LoadingServiceGeneric<'autobase/actual_batteries_on_car', { car_id: Car['asuods_id'] }, ActualBatteriesOnCar>;
export type AutobaseActualTiresOnCarApi = LoadingServiceGeneric<'autobase/actual_tires_on_car', { car_id: Car['asuods_id'] }, ActualTiresOnCar>;

import { from } from "rxjs";

export * from "./util-component";
export * from "./util-array";
export * from "./util";
export * from './util-router';
export * from "./util-regexp";
export * from "./util-date"

export function Log(info: any) {
    console.log(info)
}
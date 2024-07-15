import type { Request, Response } from "express";

export type Req<
	P = unknown,
	ReqBody = unknown,
	ReqQuery = Query,
	ResBody = unknown,
	Locals extends Record<string, any> = Record<string, unknown>,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & { auth?: any };

export type Res<
	ResBody = any,
	Locals extends Record<string, any> = Record<string, any>,
> = Response<ResBody, Locals>;

export type ParamsDictionary =
	import("express-serve-static-core").ParamsDictionary;
export type Query = import("express-serve-static-core").Query;

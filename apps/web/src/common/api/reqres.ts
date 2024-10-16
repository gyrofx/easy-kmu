import type { NextFunction, Request, Response } from 'express'

export type AnyReq = Req<unknown, unknown, unknown>

export type Req<
  P = unknown,
  ReqBody = unknown,
  ReqQuery = Query,
  ResBody = unknown,
  Locals extends Record<string, any> = Record<string, unknown>,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals>

export type ReqHandler<
  TRequest extends Req = Req,
  ResBody = unknown,
  LocalsObj extends Record<string, any> = Record<string, any>,
> = (req: TRequest, res: Response<ResBody, LocalsObj>, next: NextFunction) => void

export type Res<ResBody = any, Locals extends Record<string, any> = Record<string, any>> = Response<
  ResBody,
  Locals
>

export type ParamsDictionary = import('express-serve-static-core').ParamsDictionary
export type Query = import('express-serve-static-core').Query

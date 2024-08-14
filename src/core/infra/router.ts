import { AWS } from '@serverless/typescript';

export interface IRouter {
  toServerlessFunctions(dirName: string): AWS['functions'];
}

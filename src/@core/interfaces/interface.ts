export enum ErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 403,
  NOT_ACCEPTABLE = 406,
  INTERNAL_SERVER_ERORR = 500,
}

export interface ICacheVariable {
  varName: string;
  varValue: any;
}
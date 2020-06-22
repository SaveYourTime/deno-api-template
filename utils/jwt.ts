import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
} from "https://deno.land/x/djwt/create.ts";

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = Deno.env.toObject();

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

export const sign = (payload: object, key: string = JWT_SECRET_KEY): string => {
  return makeJwt({
    header,
    payload: {
      exp: setExpiration(new Date().getTime() + +JWT_EXPIRES_IN),
      ...payload,
    },
    key,
  });
};

export const verify = async (
  token: string,
  key: string = JWT_SECRET_KEY,
): Promise<any> => {
  return validateJwt(token, key);
};

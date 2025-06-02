import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;


interface JwtPayload {
  sub: string;       
  email: string;
  role: string;
}


export const generateToken = (userId: string, email: string, role: string): string => {
  const payload: JwtPayload = {
    sub: userId,
    email,
    role,
  };

  return jwt.sign(payload, secret as string, {
    expiresIn: '1d',  
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret as string);
};

export const extractPayload = (token: string) => {
  const payload = verifyToken(token);
  return payload as JwtPayload;
};

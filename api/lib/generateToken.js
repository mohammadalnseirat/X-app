import jwt from "jsonwebtoken";

export const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d", // 15 days
  });

//set cookies:
res.cookie('jwt_token',token,{
  httpOnly: true,// prevent XSS attacks cross-site scripting attacks
  maxAge: 15 * 24 * 60 * 60 * 1000, //MS
  sameSite:'strict',// CSRF attacks cross-site request forgery attacks
  secure:process.env.NODE_ENV !== 'development'
})
};

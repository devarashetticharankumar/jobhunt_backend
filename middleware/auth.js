const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");

dotenv.config();

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKSURI,
    }),
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: ["RS256"],
});

module.exports = { checkJwt };

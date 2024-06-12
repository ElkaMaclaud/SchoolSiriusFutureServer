const { secret } = require("../config")
const jwt = require("jsonwebtoken");
module.exports = function generateAccessToken (id)  {
	const payload = {
		id,
	}
	return jwt.sign(payload, secret, { expiresIn: "24h" })
}
const dotenv = require("dotenv")
dotenv.config()

const jwt = require("jsonwebtoken");
module.exports = function generateAccessToken (id, email)  {
	const payload = {
		id,
		email
	}
	return jwt.sign(payload, process.env.SECRET, { expiresIn: "24h" })
}
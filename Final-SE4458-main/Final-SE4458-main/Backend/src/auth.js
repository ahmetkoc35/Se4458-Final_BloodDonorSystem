const jwt = require("jsonwebtoken");

const secret = '91bd5038a3661bdf9a339ca9d2262c9d';
async function auth(req,res,next){
	try {

		let decoded = jwt.verify(req.headers["Authorization"], secret)
		req.user = decoded
	} catch(err) {
		console.log(err)
		return res.status(404).send("Token is invalid or expired")
	}
	next()
}

module.exports = {
	auth,
}
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: "Access Token is Required" });
	}

	try {
		if (token.toLowerCase().startsWith("bearer")) {
			token = token.slice("bearer".length).trim();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ message: "Invalid or Expired Token" });
	}
};

exports.checkRole = (role) => {
	return (req, res, next) => {
		if (req.user.role !== role) {
			return res.status(403).json({ message: "Access Denied" });
		}
		next();
	};
};

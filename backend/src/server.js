const PORT = process.env.PORT || 3000;
const app = require("./app.js");
const router = require("./routes");

require("dotenv").config();

// app.use("/api", router);

app.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});

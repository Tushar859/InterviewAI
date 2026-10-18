
const dns = require("node:dns");

// Use Google DNS for MongoDB SRV record lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });


// Why? Locally, the backend still uses port 3000. On Render, it uses the port supplied by the hosting service.
// const PORT = process.env.PORT || 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});


// require("dotenv").config()
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")

// connectToDB()


// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })
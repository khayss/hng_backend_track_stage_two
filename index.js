import "dotenv/config";
import config from "./config/config.js";
import app from "./app.js";

const { PORT } = config;

startServer();

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
}

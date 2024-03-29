import "./@config";
import assert from "assert";
import app from "./app";
import { connect } from "./database";

const { MONGO_URL, CERT } = process.env;
const PORT = process.env.PORT ?? "8080";

assert(MONGO_URL, "Database URL is not defined");

app.listen(parseInt(PORT), async () => {
  try {
    await connect(MONGO_URL, { cert: CERT, key: CERT });
  } catch (e) {
    throw e;
  }

  console.info(`Server listening on port ${PORT}`);
});

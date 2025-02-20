import { Server } from "http";
import app from "./app";

const PORT = 8000;

async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

main();

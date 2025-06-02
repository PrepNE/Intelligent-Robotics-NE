import { config } from "dotenv";
import app  from "./app";
import prisma from "../src/utils/client";

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    console.log(`Server running on port ${PORT}`);
  } catch (error: any) {
    console.log(error?.message)
    await prisma.$disconnect();
    process.exit(1);
  }
});
import prisma from "./client";
import { hashPassword} from "./bcrypt";
import dotenv from "dotenv";



dotenv.config();
async function main() {
  console.log("firstName", process.env.ADMIN_FIRST_NAME);
console.log("lastName", process.env.ADMIN_LAST_NAME);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@parking.com" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD!);


const admin = await prisma.user.create({
  data: {
    firstName: process.env.ADMIN_FIRST_NAME!,
    lastName: process.env.ADMIN_LAST_NAME!,
    email: process.env.ADMIN_EMAIL!,
    password: hashedPassword,
    role: "ADMIN",
  },
});


  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

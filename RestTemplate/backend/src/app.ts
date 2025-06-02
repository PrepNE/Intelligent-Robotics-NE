import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./utils/security";
import logger from "./common/logger";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import swaggerUi from 'swagger-ui-express'
import MyJson from './swagger/swagger.json'
import { errorHandler } from "./middleware/error.middleware";
import AppError from "./utils/AppError";
import docRoutes from "./routes/docs.routes";
import plateLogRoutes from "./routes/platelogs.routes";

const app: Application = express();


app.use(express.json());
app.use(cookieParser());

app.use(rateLimiter);

app.use((req, res, next) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/plate-logs", plateLogRoutes)
app.use("/api/v1/docs",docRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(MyJson))

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});



app.use(errorHandler)

export default app;

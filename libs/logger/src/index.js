import pino from "pino";

const logger = pino.pino({
  level: process.env.LOG_LEVEL || "info",
});
logger.info(`LOG_LEVEL: ${process.env.LOG_LEVEL}`);
export default logger;

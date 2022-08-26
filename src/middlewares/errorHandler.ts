import { Request, Response, NextFunction } from "express";
import log from "@providers/logger.provider";

/**
 *
 * If something goes wrong and not handled in respective place, this middleware will catch it.
 *
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
	log.error("[error] catch in global middleware.");
	log.error(err);

	if (err) {
		res.json({ message: err?.message, type: err?.name });
	}
};

export default errorHandler;

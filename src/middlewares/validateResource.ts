import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { MiddlewareType } from "@utils/types";
import log from "@providers/logger.provider";

/**
 *
 * Validate the request body, query and params by zod.
 *
 * @param schema - The schema to validate the request body against
 * @returns void
 */
const validateResource =
	(schema: AnyZodObject): MiddlewareType =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			log.info("[validation] Schema validated.");
			next();
		} catch (error: any) {
			log.error("[validation] Schema validation failed.");
			res.status(400).send(error.message);
		}
	};

export default validateResource;

import mongoose from "mongoose";
import config from "config";
import log from "@providers/logger.provider";
import { EmployeeSchema, IEmployee } from "@modules/employees/employee.model";
import { TenantSchema, ITenant } from "@modules/tenants/tenant.model";

const mongo_user = config.get<string>("mongo_user");
const mongo_password = config.get<string>("mongo_password");
const mongo_host = config.get<string>("mongo_host");

/**
 *
 * Mongo multi tenant strategy for SaaS
 * Based on mongoose
 */
export class MongoStrategy1 {
	public options: mongoose.ConnectOptions = {
		keepAlive: true,
		socketTimeoutMS: 3000,
		connectTimeoutMS: 3000,
	};

	public mongoUrl: string = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_host}/?authSource=admin&retryWrites=true&w=majority`;

	public companySchemas: { modelName: string; schema: mongoose.Schema }[];
	public tenantSchemas: { modelName: string; schema: mongoose.Schema }[];

	public constructor() {
		this.companySchemas = [{ modelName: "employees", schema: EmployeeSchema }];
		this.tenantSchemas = [{ modelName: "tenants", schema: TenantSchema }];
	}

	public connect = async (): Promise<mongoose.Mongoose> => {
		log.info("[mongo s1] connect");
		return new Promise((resolve, reject) => {
			mongoose
				.connect(this.mongoUrl, this.options)
				.then((conn) => {
					log.info("[mongo s1] Mongo connection established");
					resolve(conn);
				})
				.catch((err) => {
					log.error("[mongo s1] Mongo connection error");
					log.error(err);
					reject(err);
				});
		});
	};

	public switchDb = async (
		dbName: string,
		dbSchema: { modelName: string; schema: mongoose.Schema }[],
	): Promise<mongoose.Connection | undefined> => {
		log.info("[mongo s1] switchDb");
		const mongoose = await this.connect();

		if (mongoose.connection.readyState === 1) {
			const db: mongoose.Connection = mongoose.connection.useDb(dbName, { useCache: true });

			// Prevent from schema re-registration
			if (!Object.keys(db.models).length) {
				dbSchema.forEach(({ schema, modelName }) => {
					log.info("////////////////");
					log.info(modelName);
					log.info("////////////////");
					db.model(modelName, schema);
				});
			}

			log.info("[mongo s1] Mongo db switched to " + dbName);

			return db;
		} else {
			log.error("[mongo s1] Mongo db switch error");
			process.exit(1);
		}
	};

	public getDBModel = async (db: mongoose.Connection, modelName: string): Promise<mongoose.Model<any>> => {
		log.info("[mongo s1] getDBModel");
		return db.model(modelName);
	};

	public initTenants = async (): Promise<void> => {
		log.info("[mongo s1] initTenants");
		const tenantDB = await this.switchDb("AppTenants", this.tenantSchemas);
		const tenantModel = await this.getDBModel(tenantDB!, "tenants");

		await tenantModel.deleteMany({});

		await tenantModel.create({
			name: "Steve",
			email: "Steve@example.com",
			password: "secret",
			companyName: "Apple",
			companySlug: "apple",
		});
		await tenantModel.create({
			name: "Bill",
			email: "Bill@example.com",
			password: "secret",
			companyName: "Microsoft",
			companySlug: "microsoft",
		});
		await tenantModel.create({
			name: "Jeff",
			email: "Jeff@example.com",
			password: "secret",
			companyName: "Amazon",
			companySlug: "amazon",
		});
	};

	public initEmployees = async (): Promise<void> => {
		log.info("[mongo s1] initEmployees");
		const customers = await this.getAllTenants();

		const createEmployees = customers.map(async (tenant) => {
			const companyDB = await this.switchDb(tenant.companySlug as unknown as string, this.companySchemas);
			const employeeModel = await this.getDBModel(companyDB!, "employees");

			await employeeModel.deleteMany({});

			return employeeModel.create({
				employeeId: Math.floor(Math.random() * 10000).toString(),
				name: "John",
				companySlug: tenant.companySlug,
			});
		});

		await Promise.all(createEmployees);
	};

	public getAllTenants = async (): Promise<ITenant[]> => {
		log.info("[mongo s1] getAllTenants");
		const tenantDB = await this.switchDb("AppTenants", this.tenantSchemas);
		const tenantModel = await this.getDBModel(tenantDB!, "tenants");

		const tenants = await tenantModel.find({});

		return tenants;
	};

	// list of employees for each company database
	public listAllEmployees = async (): Promise<IEmployee[]> => {
		log.info("[mongo s1] listAllEmployees");
		const customers = await this.getAllTenants();

		const mapCustomers = customers.map(async (tenant) => {
			const companyDB = await this.switchDb(tenant.companySlug as unknown as string, this.companySchemas);
			const employeeModel = await this.getDBModel(companyDB!, "employees");
			return employeeModel.find({});
		});

		const results = await Promise.all(mapCustomers);
		return results;
	};

	public initializingS1 = async (): Promise<void> => {
		log.info("[mongo s1] Mongo s1 initializing");
		await this.initTenants();
		await this.initEmployees();

		const tenants = await this.getAllTenants();
		const employees = await this.listAllEmployees();

		log.info("[mongo s1] Tenants");
		log.info(tenants);

		log.info("[mongo s1] Employees");
		log.info(employees);
	};
}

const mongoStrategy1 = new MongoStrategy1();
export default mongoStrategy1;

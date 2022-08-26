import { InferSchemaType, Schema, model } from "mongoose";
import { getModelForClass, index, modelOptions, prop, Severity, buildSchema } from "@typegoose/typegoose";

export const EmployeeSchema: Schema = new Schema(
	{
		employeeId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
		},
		companySlug: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

EmployeeSchema.index({ employeeId: 1 }, { unique: true });

export type IEmployee = InferSchemaType<typeof EmployeeSchema>;

export const EmployeeModel = model<IEmployee>("employees", EmployeeSchema);

@modelOptions({
	schemaOptions: {
		collection: "employees",
		timestamps: true,
		versionKey: false,
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
@index({ employeeId: 1 }, { unique: true })
export class Employee {
	@prop({ required: true, unique: true, lowercase: true })
	public employeeId: string;

	@prop({ required: true })
	public name: string;

	@prop({ required: true })
	public companySlug: string;
}

export const EmployeeModelTyped = getModelForClass(Employee);
export const EmployeeSchemaTyped = buildSchema(Employee);

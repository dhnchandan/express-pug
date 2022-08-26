import { Schema, InferSchemaType, model } from "mongoose";
import { getModelForClass, index, modelOptions, prop, Severity, buildSchema } from "@typegoose/typegoose";
import argon2 from "argon2";

export const TenantSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		companyName: {
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

TenantSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await argon2.hash(this.password);
		return;
	}
});

TenantSchema.index({ email: 1 }, { unique: true });
TenantSchema.index({ companySlug: 1 }, { unique: true });

export type ITenant = InferSchemaType<typeof TenantSchema>;

export const TenantModel = model<ITenant>("tenants", TenantSchema);

@modelOptions({
	schemaOptions: {
		collection: "tenants",
		timestamps: true,
		versionKey: false,
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
@index({ email: 1 }, { unique: true })
@index({ companySlug: 1 }, { unique: true })
export class Tenant {
	@prop({ required: true, unique: true, lowercase: true })
	public email: string;

	@prop({ required: true })
	public name: string;

	@prop({ required: true })
	public password: string;

	@prop({ required: true })
	public companyName: string;

	@prop({ required: true, unique: true, lowercase: true })
	public companySlug: string;
}

export const TenantModelTyped = getModelForClass(Tenant);
export const TenantSchemaTyped: Schema = buildSchema(Tenant);

// class ClassName {}

// const schema = buildSchema(ClassName);
// // modifications to the schame can be done
// const model = addModelToTypegoose(mongoose.model("Name", schema), ClassName);

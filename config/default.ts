export default {
	port: process.env.PORT || 3050,
	log_level: process.env.LOG_LEVEL || "info",
	mongo_url: process.env.MONGO_URL,
	mongo_user: process.env.MONGO_USER,
	mongo_password: process.env.MONGO_PASSWORD,
	mongo_host: process.env.MONGO_HOST,
	jwt_secret: process.env.JWT_SECRET,
	public_key: process.env.PUBLIC_KEY,
	private_key: process.env.PRIVATE_KEY,
};

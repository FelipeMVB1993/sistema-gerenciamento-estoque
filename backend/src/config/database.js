import dotenv from "dotenv";
dotenv.config();

const databaseConfig = {
  dialect: "mariadb",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  dialectOptions: {
    timezone: "-03:00",
  },
  timezone: "-03:00",
};

export default databaseConfig;

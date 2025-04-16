import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import * as dotenv from "dotenv";

//Load env vars
dotenv.config();

// Create a DataSource instance
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || ""),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

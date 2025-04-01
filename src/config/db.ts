import mysql from "mysql2/promise.js"

export const db = mysql.createPool({
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "", // Empty string
  database: process.env.DB_NAME || "", // Whatever you named the databse when creating it
  port: parseInt(process.env.DB_PORT || "3306"),
})

export const connectToDatabase = async () => {
  try {
    await db.getConnection()
    console.log("Connected to DB")
  } catch (error: unknown) {
    console.log("Error connecting to DB" + error)
  }
}

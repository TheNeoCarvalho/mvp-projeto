import { setDefaultResultOrder } from "dns"
setDefaultResultOrder("ipv4first")

process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test"
process.env.NODE_ENV = "test"

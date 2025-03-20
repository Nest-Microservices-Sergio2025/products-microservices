import 'dotenv/config'
import * as joi from 'joi'

interface EnvsVars {
    PORT: number
    DATABASE_URL: string

    NATS_SERVERS: string[]
}
/** @type {*} */
const envSchema = joi.object<EnvsVars>({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true)

const { error, value: EnvsVars } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

export const envs = {
    PORT: EnvsVars.PORT,
    DATABASE_URL: EnvsVars.DATABASE_URL,

    NATS_SERVERS: EnvsVars.NATS_SERVERS
}

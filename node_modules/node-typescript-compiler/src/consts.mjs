import { fileURLToPath } from 'node:url'
import path from 'node:path'

/////////////////////////////////////////////////

const LIB = 'node-typescript-compiler'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/////////////////////////////////////////////////

export {
	LIB,
	__dirname,
}

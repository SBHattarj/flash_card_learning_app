import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

import { pathExists } from 'path-exists'

import { LIB, __dirname } from './consts.mjs'

/////////////////////////////////////////////////

const EXECUTABLE = 'tsc'

async function find_tsc(display_banner_if_1st_output) {

	// obvious candidate from sibling module,
	// works well if we're in node_modules
	// but won't work in exotic situations:
	// - ex. if this package is symlinked, for ex. with "npm link"
	// - ex. with alternative package managers
	const candidateⵧfrom_sibling_module =
		path.join(__dirname, '..', 'typescript', 'bin', EXECUTABLE)

	// second option: should work even if this package is symlinked
	// but still won't work with alternative package managers
	const candidateⵧfrom_caller_node_module =
		path.join(process.cwd(), 'node_modules', 'typescript', 'bin', EXECUTABLE)

	// 3rd option
	let candidateⵧfrom_import = await (async () => {
		try {
			const typescript_module = await import.meta.resolve('typescript')
			const typescript_module_dir = path.dirname(fileURLToPath(typescript_module))
			return path.join(typescript_module_dir, '..', 'bin', EXECUTABLE)
		}
		catch(err) {
			/* not found, ignore */
			//console.log('from import', err)
		}
	})()

	// last try: defaulting to an eventual global typescript module
	// (using nvm on OSX)
	const candidateⵧfrom_global_moduleⵧnvm = (() => {
		const NVM_DIR = (() => {
			// cf. resolution from nvm https://github.com/nvm-sh/nvm/blob/master/install.sh
			if (!!process.env.NVM_DIR)
				return process.env.NVM_DIR

			if (!!process.env.XDG_CONFIG_HOME)
				return path.join(process.env.XDG_CONFIG_HOME, 'nvm')

			return path.join(os.homedir(), '.nvm')
		})()

		return path.join(NVM_DIR, 'versions', 'node', process.version, 'bin', EXECUTABLE)
	})()

	async function candidate_if_exists(candidate) {
		return pathExists(candidate)
			.then(exists => {
				if (!exists)
					throw new Error(`Couldn’t find candidate typescript compiler "${candidate}"!`)
				return candidate
			})
	}

	return candidate_if_exists(candidateⵧfrom_sibling_module)
		.catch(() => candidate_if_exists(candidateⵧfrom_caller_node_module))
		.catch(() => candidate_if_exists(candidateⵧfrom_import))
		.catch(() => candidate_if_exists(candidateⵧfrom_global_moduleⵧnvm))
		.catch(() => {
			display_banner_if_1st_output()
			console.error(`[${LIB}] ❌ Couldn’t find a typescript compiler ("${EXECUTABLE}") in any expected locations. Unsuccessfully tested locations, by priority:
- ${candidateⵧfrom_sibling_module} ❌ not found
- ${candidateⵧfrom_caller_node_module} ❌ not found
- ${candidateⵧfrom_import} (from require('typescript')) ❌ not found
- ${candidateⵧfrom_global_moduleⵧnvm} ❌ not found
`)
			throw new Error(`Couldn’t find the "${EXECUTABLE}" typescript compiler in any expected locations!`)
		})
}

/////////////////////////////////////////////////

export {
	EXECUTABLE,
	find_tsc,
}

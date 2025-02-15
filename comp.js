import { config } from 'dotenv'
import tsc from 'node-typescript-compiler'
import tsconfig from "./tsconfig.json" with { type: "json" }
import {glob} from "glob"
import fs from "fs"
import { spawn } from 'child_process'
import { build } from 'vite'
import path from "node:path"
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const views_files = await glob("./src/**/*.{tsx,ts,css,js}")

config()
await tsc.compile({
    ...tsconfig.compilerOptions,
    outDir: 'dist',

}, [...views_files.filter(file => !file.endsWith(".css"))])
function stdout(data) {
    console.log(data)
}
function stderror(data) {
    console.error(data)
}

for(const file of views_files) {
    if(!file.startsWith('src/views')) continue
    if(!file.endsWith('.tsx') && ! file.endsWith('.ts')) {
            console.log(file)
            await fs.promises.copyFile(path.resolve(__dirname, `./${file}`), path.resolve(__dirname, `./dist/public/${file.replace(/^src\//, '')}`))
            await fs.promises.copyFile(path.resolve(__dirname, `./${file}`), path.resolve(__dirname, `./dist/${file.replace(/^src\//, '')}`))

    }
    await build({
        base: './',
        build: {
            emptyOutDir: false,
            rollupOptions: {
                input: path.resolve(__dirname, `./dist/${file.replace(/^src\//, '').replace(/\..+$/, '.js')}`),
                output:{
                    dir: path.resolve(__dirname, `dist/public/${file.replace(/^src\//, '').replace(/\/.+$/, '')}`),
                    entryFileNames: '[name].js',
                }

            }
        }
    })
}
if(process.argv.includes('--watch')) {

    const watcher = fs.watch('./src', { recursive: true })


    let child = spawn("node", ["./index.js"], { cwd: "dist", stdio: "inherit", env: process.env })
        .on("stdout", stdout)
        .on("stderr", stderror)


    for await (const {filename} of watcher) {
        console.log(`${filename} changed, recompiling...`)
        try {
            console.log(filename.replace(/\/[^\/]+$/, ''))
            const dirname = filename == "index.ts" ? "" : filename.replace(/\[^\/]+$/, '')
            console.log(dirname)
            if(!filename.endsWith(".css"))await tsc.compile({
                ...tsconfig.compilerOptions,
                outDir: `dist`,
            }, [`./src/${filename}`])
            if(filename.startsWith('views')) {
                if(filename.endsWith('.tsx')) {
                    
                    await build({
                        base: './',
                        build: {
                            emptyOutDir: false,
                            rollupOptions: {
                                input: path.resolve(__dirname, `./dist/${filename.replace(/\..+$/, '.js')}`),
                                output:{
                                    dir: path.resolve(__dirname, `dist/public/${filename.replace(/\/[^\/]+$/, '')}`),
                                    entryFileNames: '[name].js',
                                }

                            }
                        }
                    })
                }
                if(!filename.endsWith(".ts")) {
                    await fs.promises.copyFile(path.resolve(__dirname, `./src/${filename}`), path.resolve(__dirname, `./dist/public/${filename}`))
                    await fs.promises.copyFile(path.resolve(__dirname, `./src/${filename}`), path.resolve(__dirname, `./dist/${filename}`))
                }
            }
        }
        catch(error) {
            console.error(error)
        }
        console.log("restarting server");
        child.kill('SIGKILL')
        child = spawn("node", ["./index.js"], { cwd: "dist", stdio: "inherit", env: process.env })
            .on("stdout", stdout)
            .on("stderr", stderror)
    }
}

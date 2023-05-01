import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'yaml'

const CONFIG_DIR = resolve(__dirname, '../../.config')

/**
 * @description 根据 process.env.NODE_ENV 加载对应配置文件
 */
export function loadYAMLConfiguration() {
  const env = process.env.NODE_ENV ?? 'development'

  const pathToYAML = resolve(CONFIG_DIR, `${env}.yaml`)
  const pathToYML = resolve(CONFIG_DIR, `${env}.yml`)
  let pathToTarget = ''

  if (existsSync(pathToYAML)) {
    pathToTarget = pathToYAML
  } else if (existsSync(pathToYML)) {
    pathToTarget = pathToYML
  } else {
    console.error(`[ERRROR] Can't find yaml/yml file for ${env} environment`)
    return null
  }

  const fileContent = readFileSync(pathToTarget, { encoding: 'utf-8' })
  const resolvedConfig = parse(fileContent)

  return resolvedConfig
}

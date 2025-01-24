import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { loadEnvFromDictionary } from './loadEnvFromDictionary';

type environments = 'global' | 'stage' | 'prod' | 'local';

export function loadEnvFromServerless(filename?: environments): void {
  const globalPath = 'infra/serverless/environment/global.yaml';
  const globalEnvDict = parse(readFileSync(globalPath, 'utf8'));

  const targetFilename: environments = filename ?? ((process.env.STAGE as environments) || 'local');
  const path = 'infra/serverless/environment/' + targetFilename + '.yaml';
  const envDict = parse(readFileSync(path, 'utf8'));

  loadEnvFromDictionary(globalEnvDict);
  loadEnvFromDictionary(envDict);
}

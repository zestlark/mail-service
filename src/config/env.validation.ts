import { ENV_KEYS } from './env.keys';

export function validateEnv(config: Record<string, any>) {
  const requiredEnv = Object.values(ENV_KEYS);

  for (const env of requiredEnv) {
    if (!config[env]) {
      throw new Error(`"${env}" key is required but missing.`);
    }
  }

  return config;
}

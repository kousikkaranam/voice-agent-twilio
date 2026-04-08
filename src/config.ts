export type AppConfig = {
  port: number;
  publicBaseUrl?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: resolvePort(env.PORT),
    publicBaseUrl: normalizeBaseUrl(env.PUBLIC_BASE_URL)
  };
}

function resolvePort(value?: string): number {
  const parsedPort = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
}

function normalizeBaseUrl(value?: string): string | undefined {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return undefined;
  }

  return normalizedValue.replace(/\/+$/, "");
}

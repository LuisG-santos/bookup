declare module "next-pwa" {
  import type { NextConfig } from "next";
  import type { Configuration } from "webpack";

  interface NextPWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    buildExcludes?: string[];
    publicExcludes?: string[];
    fallbacks?: Record<string, string>;
    additionalManifestEntries?: string[];
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
  }

  type NextPWA = (options?: NextPWAOptions) => (nextConfig: NextConfig) => NextConfig;

  const withPWA: NextPWA;
  export default withPWA;
}

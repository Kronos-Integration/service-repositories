import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import ServiceRepositories from "@kronos-integration/service-repositories";

test("repositories", async t => {
  const sp = new StandaloneServiceProvider();

  await sp.declareServices({
    repositories: {
      type: ServiceRepositories,
      logLevel: "trace",
      providers: [
        {
          type: "github-repository-provider"
        },
        {
          type: "gitea-repository-provider"
        }
      ]
    }
  });

  await sp.start();
  await sp.services.repositories.start();

  const expectedProviders = [];

  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    expectedProviders.push("github");
  }
  if (process.env.GITEA_TOKEN && process.env.GITEA_API) {
    expectedProviders.push("gitea");
  }

  t.deepEqual(
    sp.services.repositories.provider.providers.map(p => p.name),
    expectedProviders
  );
});

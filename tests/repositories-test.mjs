import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import ServiceRepositories from "@kronos-integration/service-repositories";

async function repositoriesTest(t, definition, expected) {
  const sp = new StandaloneServiceProvider();

  await sp.declareServices({
    repositories: {
      type: ServiceRepositories,
      //logLevel: "trace",
      providers: definition
    }
  });

  await sp.start();
  await sp.services.repositories.start();

  const provider = await sp.services.repositories.provider();

  t.deepEqual(
    provider.providers.map(p => p.name),
    expected
  );

  await sp.stop();
}

repositoriesTest.title = (
  providedTitle = "repositories",
  definition,
  expected
) => `${providedTitle} ${JSON.stringify(definition)}`.trim();

const expectedProviders = [];

if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
  expectedProviders.push("github");
}
if (process.env.GITEA_TOKEN && process.env.GITEA_API) {
  expectedProviders.push("gitea");
}

test(
  repositoriesTest,
  [
    {
      type: "github-repository-provider"
    },
    {
      type: "gitea-repository-provider"
    }
  ],
  expectedProviders
);

test(
  repositoriesTest,
  ["github-repository-provider", "gitea-repository-provider"],
  expectedProviders
);

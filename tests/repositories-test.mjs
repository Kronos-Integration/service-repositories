import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import ServiceRepositories from "@kronos-integration/service-repositories";

test("repositories", async t => {
  const sp = new StandaloneServiceProvider();

  await sp.declareServices({
    repositories: {
      type: ServiceRepositories,
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
  await(sp.services.repositories.start());

  t.deepEqual(sp.services.repositories.provider.providers.map(p => p.name), [
    "github",
    "gitea"
  ]);
});

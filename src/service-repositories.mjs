import AggregationProvider from "aggregation-repository-provider";
import { Service } from "@kronos-integration/service";
import { prepareAttributesDefinitions, mergeAttributeDefinitions, default_attribute } from "pacc";

/**
 * Provide repositories.
 */
export class ServiceRepositories extends Service {
  static attributes = mergeAttributeDefinitions(
    prepareAttributesDefinitions({
      providers: {
        ...default_attribute,
        description: "list of providers to be accessed",
        needsRestart: true
      }
    }),
    Service.attributes
  );

  /**
   * @return {string} 'repositories'
   */
  static get name() {
    return "repositories";
  }

  #provider;

  async _start() {
    await super._start();

    const providers = await Promise.all(
      this.providers.map(async def => {
        const [type, options] =
          typeof def === "string" ? [def, {}] : [def.type, def];

        const m = await import(type);

        this.trace(`import ${type} -> ${m.default.name}`);

        return m.default.initialize(options, process.env);
      })
    );

    this.#provider = new AggregationProvider(providers);
  }

  async provider() {
    await this.start();
    return this.#provider;
  }
}

export default ServiceRepositories;

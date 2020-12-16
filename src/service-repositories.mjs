import AggregationProvider from "aggregation-repository-provider";
import { Service } from "@kronos-integration/service";
import { mergeAttributes, createAttributes } from "model-attributes";

/**
 * Provide repositories.
 */
export class ServiceRepositories extends Service {
  static get configurationAttributes() {
    return mergeAttributes(
      super.configurationAttributes,
      createAttributes({
        providers: {
          description: "list of providers to be accessed",
          needsRestart: true
        }
      })
    );
  }

  /**
   * @return {string} 'repositories'
   */
  static get name() {
    return "repositories";
  }

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

    this.provider = new AggregationProvider(providers);
  }
}

export default ServiceRepositories;

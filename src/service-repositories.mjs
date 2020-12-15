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
        providers: {}
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
      this.providers.map(async provider => {
        const m = await import(provider.type);

        this.trace(`import ${provider.type} -> ${m.default.name}`);
        delete provider.type;

        const instance = m.default.initialize(
          provider,
          process.env
        );


        this.trace(`initialized as ${instance.name}`);
        return instance;
      })
    );
    
    this.provider = new AggregationProvider(providers);
  }
}

export default ServiceRepositories;

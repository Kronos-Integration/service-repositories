import AggregationProvider from "aggregation-repository-provider";
import { Service } from "@kronos-integration/service";
import { mergeAttributes, createAttributes } from "model-attributes";

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

        delete provider.type;

        return m.default.initialize(
          provider,
          process.env
        );
      })
    );

    console.log(providers);
    
    this.provider = new AggregationProvider(providers);
  }
}

export default ServiceRepositories;

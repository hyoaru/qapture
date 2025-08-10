import { DagreNodeLayoutStrategy } from "./dagre";
import type { INodeLayoutStrategy } from "./interface";

export class NodeLayoutStrategyFactory {
  static create(strategy: string): INodeLayoutStrategy {
    switch (strategy) {
      case "dagre":
        return new DagreNodeLayoutStrategy();
      default:
        throw new Error(`Unknown layout strategy: ${strategy}`);
    }
  }
}

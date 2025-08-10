import type { INodeLayoutEngine } from "./interface";
import {
  NodeLayoutStrategyFactory,
  type INodeLayoutStrategy,
} from "./strategies";

export class NodeLayoutEngine implements INodeLayoutEngine {
  #strategy: INodeLayoutStrategy;
  constructor() {
    this.#strategy = NodeLayoutStrategyFactory.create("dagre");
  }
  run({ nodes, edges }: Parameters<INodeLayoutEngine["run"]>[0]) {
    return this.#strategy.run({ nodes, edges });
  }
}

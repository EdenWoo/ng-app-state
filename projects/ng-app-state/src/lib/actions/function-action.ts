import { clone } from "micro-dash";
import { AppStateAction } from "./app-state-action";

/** @private */
export class FunctionAction extends AppStateAction {
  constructor(
    name: string,
    path: string[],
    private mutates: boolean,
    private func: Function,
    private args: any[],
  ) {
    super(name, path);
  }

  public execute<T>(state: T) {
    return this.getNewState(this.path, state);
  }

  ///////

  protected getNewState<T>(path: string[], oldState: T) {
    if (path.length) {
      if (oldState == null) {
        console.error(
          this.path.slice(0, -path.length).join(".") +
            ` is null or undefined (during ${this.type})`,
        );
        return oldState;
      }

      const key = path[0] as keyof T;
      const oldChildState = oldState[key];
      const newChildState = this.getNewState(path.slice(1), oldChildState);
      if (newChildState === oldChildState) {
        return oldState;
      }

      const newState = clone(oldState);
      newState[key] = newChildState;
      return newState;
    } else if (this.mutates) {
      const newState = clone(oldState);
      this.func(newState, ...this.args);
      return newState;
    } else {
      return this.func(oldState, ...this.args);
    }
  }
}

export function buildName(prefix: string, func: Function) {
  if (func.name) {
    return `${prefix}:${func.name}`;
  } else {
    return prefix;
  }
}

import {AppStateAction} from '../app-state-action';
import {omit} from 'micro-dash';

export class DeleteAction extends AppStateAction {
  constructor(path: string[]) {
    super('delete', path);
  }

  protected getNewState<T extends object>(path: string[], oldState: T) {
    if (path.length > 1) {
      return super.getNewState(path, oldState);
    } else {
      return omit(oldState, path[0] as keyof T);
    }
  }
}

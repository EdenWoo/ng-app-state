import { StoreObject } from '../store-object';

export abstract class UndoManager<StateType, UndoStateType> {
  private stack: UndoStateType[] = [];
  private currentStateIndex: number;

  constructor(private store: StoreObject<StateType>) {
    this.reset();
  }

  reset() {
    this.currentStateIndex = -1;
    this.pushCurrentState();
  }

  pushCurrentState() {
    ++this.currentStateIndex;
    this.stack[this.currentStateIndex] =
      this.extractUndoState(this.store.state());
    this.stack.splice(this.currentStateIndex + 1, this.stack.length);
  }

  canUndo() {
    return this.currentStateIndex > 0;
  }

  canRedo() {
    return this.currentStateIndex < this.stack.length - 1;
  }

  undo() {
    if (!this.canUndo()) { throw new Error('Cannot undo'); }

    --this.currentStateIndex;
    this.applyCurrentState();
  }

  redo() {
    if (!this.canRedo()) { throw new Error('Cannot redo'); }

    ++this.currentStateIndex;
    this.applyCurrentState();
  }

  protected abstract extractUndoState(state: StateType): UndoStateType;

  protected abstract applyUndoState(
    undoState: UndoStateType, batch: StoreObject<StateType>,
  ): void;

  private applyCurrentState() {
    this.store.batch((batch) => {
      this.applyUndoState(this.stack[this.currentStateIndex], batch);
    });
  }
}
export class CircularArray<T> {
  constructor(readonly items: T[], private i: number = 0) { }
  next() {
    return (this.i + 1) < this.items.length
      ? new CircularArray(this.items, this.i + 1)
      : new CircularArray(this.items, 0);
  }
  prev() {
    return (this.i - 1) >= 0
      ? new CircularArray(this.items, this.i - 1)
      : new CircularArray(this.items, this.items.length - 1);
  }
  get current() {
    return this.items[this.i];
  }
}

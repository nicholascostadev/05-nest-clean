import { WatchedList } from './watched-list';

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number) {
    return a === b;
  }
}

describe('Watched List', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toEqual([1, 2, 3]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to add new items to the watched list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.getItems()).toHaveLength(4);
    expect(list.getItems()).toEqual([1, 2, 3, 4]);
    expect(list.getNewItems()).toEqual([4]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to remove items from the watched list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);

    expect(list.getItems()).toHaveLength(2);
    expect(list.getItems()).toEqual([1, 3]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it('should be able to add new item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);
    list.add(2);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it('should be able to update items from the watched list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 5]);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getItems()).toEqual(expect.arrayContaining([1, 3, 5]));
    expect(list.getNewItems()).toEqual([5]);
    expect(list.getRemovedItems()).toEqual([2]);
  });
});

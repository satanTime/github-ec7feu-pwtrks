import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
// import { MockBuilder, MockRender } from 'ng-mocks';
import { cold } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { TestBed } from '@angular/core/testing';

@Injectable()
export class MyComponentStore extends ComponentStore<{ value: string }> {
  constructor() {
    super({ value: 'value' });
  }

  readonly values$ = this.select(({ value }) => value);
}

describe('MyComponentStore', () => {
  let componentStore: MyComponentStore;

  // beforeEach(() => MockBuilder(MyComponentStore));
  beforeEach(() => TestBed.configureTestingModule({
    providers: [MyComponentStore],
  }).compileComponents());

  beforeEach(() => {
    // componentStore = MockRender(MyComponentStore).point.componentInstance;
    componentStore = TestBed.inject(MyComponentStore);
  });

  // This test no longer works with ng-mocks >= 13.3.0
  it('should initial state and value', () => {
    expect(componentStore.state$).toBeObservable(
      cold('a', { a: { value: 'value' } })
    );
    expect(componentStore.values$).toBeObservable(cold('a', { a: 'value' }));
  });

  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  // However, this one works all the time (without jest-marble)
  it('should have initial state', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;

      expectObservable(componentStore.state$).toBe('a', {
        a: { value: 'value' },
      });
      expectObservable(componentStore.values$).toBe('a', { a: 'value' });
    });
  });
});

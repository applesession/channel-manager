import {
  QueryClient,
  QueryObserver,
  type DefaultError,
  type QueryKey,
  type QueryObserverOptions,
} from '@tanstack/react-query';
import { createAtom, reaction } from 'mobx';

// note : Класс для интегрирования Mobx + Tanstack Query напрямую

export class MobxQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> {
  private atom = createAtom(
    'MobxQuery',
    () => this.startTracking(),
    () => this.stopTracking()
  );

  private queryObserver: QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;

  constructor(
    private getOptions: () => QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >,
    private queryClient: QueryClient
  ) {
    this.queryObserver = new QueryObserver(this.queryClient, this.defaultedQueryOptions);
  }

  result() {
    this.atom.reportObserved();
    this.queryObserver.setOptions(this.defaultedQueryOptions);
    return this.queryObserver.getOptimisticResult(this.defaultedQueryOptions);
  }

  private unsubscribe = () => {};

  private startTracking() {
    const unsubcribeReaction = reaction(
      () => this.defaultedQueryOptions,
      () => {
        this.queryObserver.setOptions(this.defaultedQueryOptions);
      }
    );

    const unsubcribeObserver = this.queryObserver.subscribe(() =>
      this.atom.reportChanged()
    );

    this.unsubscribe = () => {
      unsubcribeReaction();
      unsubcribeObserver();
    };
  }

  private stopTracking() {
    this.unsubscribe();
  }

  private get defaultedQueryOptions() {
    return this.queryClient.defaultQueryOptions(this.getOptions());
  }
}

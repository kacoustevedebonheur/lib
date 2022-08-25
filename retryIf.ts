/**
Author: Steve De bonheur 
Licence: Free to use

USAGE: 
httpRequestObservable.pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponseBase),
      retryIf(
        (httpEvent) =>
          httpEvent instanceof HttpResponseBase && httpEvent.status === ApiStatusCode.RequestBeingProcessing,
        { retryDelay: 1000, retryCount: 3 }
      )
    );
  }

*/
import { Observable, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

export function retryIf<T>(
  project: (value: T) => boolean,
  config: { retryCount: number; retryDelay?: number } = {
    retryCount: 3,
    retryDelay: 1000,
  },
  thisArg?: any
) {
  return (source: Observable<T>) => {
    let innerSub: Subscription | null;
    let { retryCount, retryDelay } = config;
    return new Observable<T>((subscriber) => {
      const resub = () => {
        innerSub = source.pipe(delay(retryDelay)).subscribe({
          next(value) {
            const shouldRetry = project.call(thisArg, value);
            if (retryCount === 0 || !shouldRetry) {
              subscriber.next(value);
              subscriber.complete();
            }
            retryCount = retryCount - 1;
          },
          error(err) {
            subscriber.error(err);
          },
          complete() {
            resub();
          },
        });
      };
      resub();
      return () => {
        innerSub?.unsubscribe();
      };
    });
  };
}

import { PartialObserver, Subscription } from 'rxjs';

export type Consumer<T> = (t: T) => void;
export type Func<T, R> = (t: T) => R;
export type UnaryOperator<T> = Func<T, T>;

/**
 * Extending default {@link HTMLAudioElement} because it works in Chrome
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId}
 */
export interface ChromeHTMLAudioElement extends HTMLAudioElement {
  setSinkId(sinkId: string): Promise<void>;
}

/**
 * https://stackoverflow.com/a/43001581
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
/**
 * https://stackoverflow.com/a/43001581
 */
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export interface Closeable {
  close(): void | Promise<void>;
}

export interface IObservable<T> {
  /**
   * Note: Must make sure to call onNext() with the last emitted value for each new subscriber
   * @param observer
   */
  subscribe(observer: PartialObserver<T>): Subscription;
}

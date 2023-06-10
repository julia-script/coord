interface Map<K, V> {
  has(value: string): value is K;
}

declare module "@use-gesture/react" {
  export type Handler<
    Key extends GestureKey,
    EventType = EventTypes[Key],
    TMemo = unknown
  > = (
    state: Omit<FullGestureState<Key>, "event"> & {
      event: EventType;
      memo?: TMemo;
    }
  ) => any | void;
}

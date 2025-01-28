interface Drawable {
  draw(data: google.visualization.DataTable, options: unknown): void;
}

export type Chart = {
  [K in keyof typeof google.visualization]: K extends 'ControlWrapper'
    ? never
    : (typeof google.visualization)[K] extends new (
          ...args: readonly any[]
        ) => Drawable
      ? K
      : never;
}[keyof typeof google.visualization];

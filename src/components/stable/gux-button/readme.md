# gux-button

This custom component is a simple button having some styling on it.
You can choose between two type (secondary and primary).

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                  | Type                                                | Default       |
| ---------- | ----------- | -------------------------------------------- | --------------------------------------------------- | ------------- |
| `accent`   | `accent`    | The component accent (secondary or primary). | `"ghost" \| "primary" \| "secondary" \| "tertiary"` | `'secondary'` |
| `disabled` | `disabled`  | Indicate if the button is disabled or not    | `boolean`                                           | `false`       |
| `guxTitle` | `gux-title` | The component title                          | `string`                                            | `undefined`   |
| `type`     | `type`      | The component button type                    | `"button" \| "reset" \| "submit"`                   | `'button'`    |


## Dependencies

### Used by

 - [gux-toolbar-action](../../beta/gux-toolbar/gux-toolbar-action)

### Graph
```mermaid
graph TD;
  gux-toolbar-action --> gux-button
  style gux-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

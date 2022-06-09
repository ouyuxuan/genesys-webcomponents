# gux-table-header-popover

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute                | Description                                                                          | Type                                                                                                                                                                 | Default     |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `closeOnClickOutside` | `close-on-click-outside` | Close popover when the user clicks outside of its bounds                             | `boolean`                                                                                                                                                            | `false`     |
| `for`                 | `for`                    | Indicates the id of the element the popover should anchor to                         | `string`                                                                                                                                                             | `undefined` |
| `position`            | `position`               | Indicate position of popover element arrow (follow popper js position attribute api) | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom'`  |


## Events

| Event        | Description                             | Type                |
| ------------ | --------------------------------------- | ------------------- |
| `guxdismiss` | Fired when a user dismisses the popover | `CustomEvent<void>` |


## Dependencies

### Used by

 - [gux-table-header-menu](..)

### Graph
```mermaid
graph TD;
  gux-table-header-menu --> gux-table-header-popover
  style gux-table-header-popover fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

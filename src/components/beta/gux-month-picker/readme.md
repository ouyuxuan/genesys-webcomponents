# gux-month-picker



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                     | Type      | Default |
| ---------- | ----------- | ----------------------------------------------- | --------- | ------- |
| `disabled` | `disabled`  | Indicate if the month picker is disabled or not | `boolean` | `false` |
| `maxMonth` | `max-month` | The max month selectable                        | `string`  | `''`    |
| `maxYear`  | `max-year`  | The max year selectable                         | `string`  | `''`    |
| `minMonth` | `min-month` | The min month selectable                        | `string`  | `''`    |
| `minYear`  | `min-year`  | The min year selectable                         | `string`  | `''`    |
| `value`    | `value`     | The month picker current value                  | `string`  | `''`    |


## Events

| Event   | Description                         | Type                  |
| ------- | ----------------------------------- | --------------------- |
| `input` | Triggered when user selects a month | `CustomEvent<string>` |


## Dependencies

### Depends on

- [gux-icon](../../stable/gux-icon)
- [gux-month-calendar-beta](../gux-month-calendar)

### Graph
```mermaid
graph TD;
  gux-month-picker-beta --> gux-icon
  gux-month-picker-beta --> gux-month-calendar-beta
  gux-month-calendar-beta --> gux-icon
  style gux-month-picker-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

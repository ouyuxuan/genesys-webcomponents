# Web Component Design Best Practices

Best practices for developing presentational web components that have a nice API and are easy to work with.

 - [Prefer structured markup](#markdown-header-prefer-structured-markup-over-complex-attributes-over-js-interfaces)
 - [Use a consistent input API](#markdown-header-use-a-consistent-api-for-components-that-accept-input)

## Prefer structured markup over complex attributes or js interfaces

Imagine we're going to create a component for representing menus. Menu data might look like this:

```javascript
{
  appetizers: [
    { name: 'fried pickles', price: 400 },
    { name: 'bruschetta', price: 500 }
  ],
  entrees: [
    { name: 'tacos', price: 600 },
    { name: 'hamburger', price: 700 }
  ]
}
```

### Structured Markup (good)

This is a nice design. It lets the structure of the document match the structure of the data. If the API
need to be changed or split in the future, small pieces can be changed (like just updating `gux-menu-item`) while
the rest of the API remains stable. It's fairly easy to read and find problems in the input.

```html
<gux-menu>
  <gux-menu-section slot="appetizers">
    <gux-menu-item price="400">fried pickles</gux-menu-item>
    <gux-menu-item price="500">bruschetta</gux-menu-item>
  </gux-menu-section>
  <gux-menu-section slot="entrees">
    <gux-menu-item price="600">tacos</gux-menu-item>
    <gux-menu-item price="700">hamburger</gux-menu-item>
  </gux-menu-section>
</gux-menu>
```

### Complex Attributes (bad)

This design is less useful. Putting the entire API into a single string makes the interface fragile (a stray typo
will break input parsing). Contract violations are also harder to detect, as there's one big contract for a single
element instead of multiple small contracts for small elements.

```html
<gux-menu menu-data="{ appetizers: [ ... ], entrees: [ ... ]}"></gux-menu>
```

### JS API (bad)

This approach is even less useful than an attribute, since it shares most of the same disadvantages and
attributes can be accessed both via markup and a JavaScript API.

```html
<gux-menu id="theMenu"></gux-menu>
<script>
  document.getElmentById('theMenu').setData(menuData);
</script>
```

## Use a consistent API for components that accept input

For components that accept user input somehow, there should be consistent APIs for setting the value of
those components and for events emitted by the components. In particular components that accept input:

- Should have a `value` attribute and property, like the various native input-related elements
  - An additional boolean attribute similar to `checked` may be appropriate for elements with boolean state.
- Should emit the `input` event (at a minimum) with the `detail` property on the event set to the data the
component is intended to get from the user.
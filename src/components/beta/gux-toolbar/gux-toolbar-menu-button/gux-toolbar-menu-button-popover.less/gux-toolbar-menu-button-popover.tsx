import { Component, Prop, Watch, JSX, h } from '@stencil/core';

import { createPopper, Instance } from '@popperjs/core';

/**
 * @slot target - Required slot for target
 * @slot popup - required slot for popup
 */

@Component({
  styleUrl: 'gux-toolbar-menu-button-popover.tsx',
  tag: 'gux-toolbar-menu-button-popover',
  shadow: true
})
export class GuxToolbarMenuButtonPopover {
  private popperInstance: Instance;
  private targetElementContainer: HTMLElement;
  private popupElementContainer: HTMLElement;

  @Prop()
  expanded: boolean = false;

  @Watch('expanded')
  onExpandedChange(expanded: boolean) {
    if (expanded) {
      this.popperInstance.forceUpdate();
    }
  }

  componentDidLoad(): void {
    this.popperInstance = createPopper(
      this.targetElementContainer,
      this.popupElementContainer,
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 4]
            }
          }
        ],
        placement: 'bottom-end'
      }
    );
  }

  disconnectedCallback(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
  }

  render(): JSX.Element {
    return (<div></div>) as JSX.Element;
  }
}

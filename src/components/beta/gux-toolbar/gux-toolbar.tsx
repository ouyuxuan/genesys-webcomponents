import { Component, Element, JSX, h, Host } from '@stencil/core';

/**
 * @slot filter - Slot for filter option.
 */

@Component({
  styleUrl: 'gux-toolbar.less',
  tag: 'gux-toolbar-beta',
  shadow: true
})
export class GuxToolbar {
  /**
   * Reference to the host element
   */
  @Element()
  root: HTMLElement;

  private renderSearchFilterActions(): JSX.Element {
    return (<slot name="searchFilter" />) as JSX.Element;
  }

  private renderContextualPermanentActions(): JSX.Element {
    return (
      <div class="gux-permanent-contextual-container">
        <slot name="contextual" />
        <div class="seperator" />
        <slot name="permanent" />
      </div>
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (
      <Host>
        {this.renderSearchFilterActions()}
        {this.renderContextualPermanentActions()}
      </Host>
    ) as JSX.Element;
  }
}

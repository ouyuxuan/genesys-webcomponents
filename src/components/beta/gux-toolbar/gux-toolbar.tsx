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
        <div class="gux-contextual-actions">
          <slot name="contextual" />
        </div>
        <div class="seperator" />
        <div class="gux-permanent-actions">
          <slot name="permanent" />
        </div>
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

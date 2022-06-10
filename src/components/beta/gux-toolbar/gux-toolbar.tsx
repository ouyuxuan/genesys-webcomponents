import { Component, Element, JSX, h, Host, Prop } from '@stencil/core';

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

  @Prop()
  search: boolean;

  private renderSearchFilterActions(): JSX.Element {
    return (
      <div class="gux-search-filter">
        {this.search ? (
          <gux-form-field-search>
            <input
              slot="input"
              type="search"
              name="lp-1"
              placeholder="Search"
            />
          </gux-form-field-search>
        ) : null}
        <slot name="filter" />
      </div>
    ) as JSX.Element;
  }

  private renderContextualPermanentActions(): JSX.Element {
    return (
      <div class="gux-permanent-contextual-container">
        <div class="gux-contextual-actions">
          <slot name="contextual" />
        </div>
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

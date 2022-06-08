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

  private renderSearchFilterControls(): JSX.Element {
    return (
      <div class="gux-search-filter">
        <gux-form-field-search>
          <input slot="input" type="search" name="lp-1" placeholder="Search" />
        </gux-form-field-search>
        <slot name="filter" />
      </div>
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (<Host>{this.renderSearchFilterControls()}</Host>) as JSX.Element;
  }
}

import { Component, Element, JSX, h, Host } from '@stencil/core';

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

  private renderSearchField(): JSX.Element {
    return (
      <gux-form-field-search>
        <input slot="input" type="search" name="lp-1" />
        <label slot="label">Default</label>
      </gux-form-field-search>
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (<Host>{this.renderSearchField()}</Host>) as JSX.Element;
  }
}

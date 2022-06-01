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

  render(): JSX.Element {
    return (<Host></Host>) as JSX.Element;
  }
}

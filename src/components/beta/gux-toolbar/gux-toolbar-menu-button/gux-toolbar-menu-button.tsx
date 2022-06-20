import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

import { trackComponent } from '../../../../usage-tracking';

@Component({
  styleUrl: 'gux-toolbar-menu-button',
  tag: 'gux-toolbar-menu-button',
  shadow: true
})
export class GuxToolbarMenuButton {
  listElement: HTMLGuxListElement;
  dropdownButton: HTMLElement;

  /**
   * Reference to the host element
   */
  @Element()
  private root: HTMLElement;

  /**
   * Triggered when menu is opened
   */
  @Event()
  open: EventEmitter;

  /**
   * Triggered when menu is closed
   */
  @Event()
  closed: EventEmitter;

  /**
   * The component text
   */
  @Prop()
  text: string;

  componentWillLoad(): void {
    trackComponent(this.root);
  }
}

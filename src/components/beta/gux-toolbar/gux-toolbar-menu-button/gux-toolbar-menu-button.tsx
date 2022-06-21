import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  JSX,
  Listen
} from '@stencil/core';

import { trackComponent } from '../../../../usage-tracking';
import { OnClickOutside } from '../../../../utils/decorator/on-click-outside';

@Component({
  styleUrl: 'gux-toolbar-menu-button',
  tag: 'gux-toolbar-menu-button',
  shadow: true
})
export class GuxToolbarMenuButton {
  listElement: HTMLGuxListElement;
  dropdownButton: HTMLElement;
  private moveFocusDelay: number = 100;

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

  /* Used to open and closed he list */
  @Prop({ mutable: true })
  isOpen: boolean = false;

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    const composedPath = event.composedPath();

    switch (event.key) {
      case 'Escape':
        this.isOpen = false;

        if (composedPath.includes(this.listElement)) {
          event.preventDefault();
          this.dropdownButton.focus();
        }

        break;
      case 'Tab': {
        this.isOpen = false;
        break;
      }
      case 'ArrowDown':
      case 'Enter':
        if (composedPath.includes(this.dropdownButton)) {
          event.preventDefault();
          this.isOpen = true;
          this.focusFirstItemInPopupList();
        }
        break;
    }
  }

  @Listen('keyup')
  handleKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ': {
        const composedPath = event.composedPath();

        if (composedPath.includes(this.dropdownButton)) {
          this.isOpen = true;
          this.focusFirstItemInPopupList();
        }
        break;
      }
    }
  }

  private toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusPopupList();
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside(): void {
    this.isOpen = false;
  }

  private focusPopupList(): void {
    setTimeout(() => {
      this.listElement.focus();
    }, this.moveFocusDelay);
  }

  private focusFirstItemInPopupList(): void {
    setTimeout(() => {
      void this.listElement.guxFocusFirstItem();
    }, this.moveFocusDelay);
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <gux-toolbar-menu-button-popover expanded={this.isOpen}>
        <div slot="target" class="gux-toolbar-menu-container">
          <gux-button-slot-beta class="gux-dropdown-button">
            <button
              type="button"
              ref={el => (this.dropdownButton = el)}
              onMouseUp={() => this.toggle()}
              aria-haspopup="true"
              aria-expanded={this.isOpen.toString()}
            >
              <gux-icon decorative icon-name="menu-kebab-horizontal"></gux-icon>
            </button>
          </gux-button-slot-beta>
        </div>
        <div slot="popup">
          <gux-list ref={el => (this.listElement = el)}>
            <slot />
          </gux-list>
        </div>
      </gux-toolbar-menu-button-popover>
    ) as JSX.Element;
  }
}

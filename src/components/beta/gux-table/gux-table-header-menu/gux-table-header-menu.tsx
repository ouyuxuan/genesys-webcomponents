import {
  Component,
  h,
  Host,
  Element,
  JSX,
  Listen,
  Prop,
  State
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { eventIsFrom } from '../../../../utils/dom/event-is-from';
import { randomHTMLId } from '../../../../utils/dom/random-html-id';
import tableResources from '../i18n/en.json';

/**
 * @slot default - Required slot for gux-all-row-select element
 * @slot header-menu-options - Optional slot for gux-list containing gux-list-item children
 */

@Component({
  styleUrl: 'gux-table-header-menu.less',
  tag: 'gux-table-header-menu'
})
export class GuxTableHeaderMenu {
  private tableHeaderMenuButtonElement: HTMLButtonElement;
  private dropdownOptionsButtonId: string = randomHTMLId(
    'gux-table-header-menu'
  );
  private moveFocusDelay: number = 100;

  @Element()
  root: HTMLElement;

  private i18n: GetI18nValue;

  private hasHeaderMenuOptions: boolean = false;

  @Prop()
  dropdownDisabled: boolean = false;

  @State()
  private popoverHidden: boolean = true;

  private focusFirstItemInPopupList(): void {
    const listElement: HTMLGuxListElement = this.root.querySelector('gux-list');
    setTimeout(() => {
      void listElement?.guxFocusFirstItem();
    }, this.moveFocusDelay);
  }

  async componentWillLoad(): Promise<void> {
    this.hasHeaderMenuOptions = !!this.root.querySelector(
      '[slot="header-menu-options"]'
    );
    this.i18n = await buildI18nForComponent(this.root, tableResources);
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (eventIsFrom('.gux-header-menu-button', event)) {
          this.toggleOptions();
          this.focusFirstItemInPopupList();
        }
        break;
      case 'Enter':
        if (eventIsFrom('.gux-header-menu-button', event)) {
          void this.focusFirstItemInPopupList();
        }
        break;
      case 'Escape':
        if (eventIsFrom('gux-list', event)) {
          event.stopPropagation();
          this.popoverHidden = true;
          this.tableHeaderMenuButtonElement?.focus();
        }
        break;
    }
  }

  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        if (eventIsFrom('.gux-header-menu-button', event)) {
          this.focusFirstItemInPopupList();
        }
    }
  }
  private toggleOptions(): void {
    this.popoverHidden = !this.popoverHidden;
  }

  private renderHeaderDropdown(): JSX.Element {
    if (this.hasHeaderMenuOptions) {
      return [
        <button
          aria-expanded={(!this.popoverHidden).toString()}
          type="button"
          class="gux-header-menu-button"
          ref={el => (this.tableHeaderMenuButtonElement = el)}
          onClick={() => this.toggleOptions()}
          disabled={this.dropdownDisabled}
        >
          <gux-icon
            icon-name="chevron-small-down"
            screenreader-text={this.i18n('tableOptions')}
          ></gux-icon>
        </button>,
        <gux-table-header-popover
          position="bottom-start"
          for={this.dropdownOptionsButtonId}
          hidden={this.popoverHidden}
          closeOnClickOutside={true}
          onGuxdismiss={() => (this.popoverHidden = true)}
        >
          <div>
            <slot name="header-menu-options" />
          </div>
        </gux-table-header-popover>
      ] as JSX.Element;
    }
  }

  render(): JSX.Element {
    return (
      <Host id={this.dropdownOptionsButtonId}>
        <slot />
        {this.renderHeaderDropdown()}
      </Host>
    ) as JSX.Element;
  }
}

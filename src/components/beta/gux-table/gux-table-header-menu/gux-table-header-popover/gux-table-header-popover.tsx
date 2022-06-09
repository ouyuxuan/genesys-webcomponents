import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { OnClickOutside } from '../../../../../utils/decorator/on-click-outside';
import { onHiddenChange } from '../../../../../utils/dom/on-attribute-change';
import { trackComponent } from '../../../../../usage-tracking';

import { PopperPosition } from './gux-table-header-popover.types';

@Component({
  styleUrl: 'gux-table-header-popover.less',
  tag: 'gux-table-header-popover',
  shadow: true
})
export class GuxTableHeaderPopover {
  private popperInstance: Instance;
  private hiddenObserver: MutationObserver;
  private popupElement: HTMLDivElement;

  @Element()
  private root: HTMLElement;

  /**
   * Indicates the id of the element the popover should anchor to
   */
  @Prop()
  for: string;

  /**
   * Indicate position of popover element arrow (follow popper js position attribute api)
   */
  @Prop()
  position: PopperPosition = 'bottom';

  /**
   * Close popover when the user clicks outside of its bounds
   */
  @Prop()
  closeOnClickOutside: boolean = false;

  /**
   * Fired when a user dismisses the popover
   */
  @Event()
  guxdismiss: EventEmitter<void>;

  @State()
  hidden: boolean = true;

  @Watch('hidden')
  hiddenHandler(hidden: boolean) {
    if (!hidden && !this.popperInstance) {
      this.runPopper();
    } else if (!hidden && this.popperInstance) {
      this.popperInstance.forceUpdate();
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  checkForClickOutside(event: MouseEvent) {
    const clickPath = event.composedPath();
    const forElement = document.getElementById(this.for);
    const clickedForElement = clickPath.includes(forElement);

    if (this.closeOnClickOutside && !this.hidden && !clickedForElement) {
      this.dismiss();
    }
  }

  private runPopper(): void {
    const forElement = document.getElementById(this.for);

    if (!forElement) {
      console.error(
        `gux-table-header-popover: invalid "for" attribute. No element in page with the id "${this.for}"`
      );
    } else if (this.popupElement) {
      this.popperInstance = createPopper(forElement, this.popupElement, {
        strategy: 'fixed',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 0]
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'right']
            }
          }
        ],
        placement: this.position
      });
    }
  }

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private dismiss(): void {
    const dismissEvent = this.guxdismiss.emit();
    if (!dismissEvent.defaultPrevented) {
      this.root.setAttribute('hidden', '');
    }
  }

  connectedCallback(): void {
    trackComponent(this.root, { variant: this.position });

    this.hiddenObserver = onHiddenChange(this.root, (hidden: boolean) => {
      this.hidden = hidden;
    });

    this.hidden = this.root.hidden;
  }

  componentDidLoad(): void {
    this.runPopper();
  }

  disconnectedCallback(): void {
    this.destroyPopper();
    this.hiddenObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <div
        ref={(el: HTMLDivElement) => (this.popupElement = el)}
        class="gux-popover-wrapper"
      >
        {/* <div class="gux-arrow" data-popper-arrow /> */}
        <div class="gux-popover-content">
          <slot />
        </div>
      </div>
    ) as JSX.Element;
  }
}

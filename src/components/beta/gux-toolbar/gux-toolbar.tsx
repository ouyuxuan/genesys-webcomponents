import {
  Component,
  Element,
  JSX,
  h,
  Host,
  readTask,
  EventEmitter,
  Event
} from '@stencil/core';

/**
 * @slot filter - Slot for filter option.
 */

/**
 * Below is the minimum spacing in px that is required between,
 * the controls aligned to the left and controls aligned to the right.
 */
const MIN_SPACING = 72;

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

  @Event()
  emitLayoutChange: EventEmitter<boolean>;

  private resizeOberser?: ResizeObserver;

  private renderSearchFilterActions(): JSX.Element {
    return (<slot name="searchFilter" />) as JSX.Element;
  }

  private sectionSpacing(): JSX.Element {
    return (<div class="section-spacing" />) as JSX.Element;
  }

  private renderContextualPermanentPrimary(): JSX.Element {
    return (
      <div class="gux-contextual-permanent-primary">
        <slot name="contextual" />
        <div class="seperator" />
        <slot name="permanent" />
        <slot name="primary" />
      </div>
    ) as JSX.Element;
  }

  private checkSpacingBetweenSections() {
    readTask(() => {
      const el = this.root.shadowRoot.querySelector('.section-spacing');
      const layoutContainerWidth = el.clientWidth;

      if (layoutContainerWidth == MIN_SPACING) {
        this.emitLayoutChange.emit(true);
      }
    });
  }

  componentDidLoad() {
    if (!this.resizeOberser && window.ResizeObserver) {
      this.resizeOberser = new ResizeObserver(() => {
        this.checkSpacingBetweenSections();
      });
    }

    if (this.resizeOberser) {
      this.resizeOberser.observe(
        this.root.shadowRoot.querySelector('.section-spacing')
      );
    }

    setTimeout(() => {
      this.checkSpacingBetweenSections();
    }, 500);
  }

  disconnectedCallback() {
    if (this.resizeOberser) {
      this.resizeOberser.unobserve(
        this.root.shadowRoot.querySelector('.section-spacing')
      );
    }
  }

  render(): JSX.Element {
    return (
      <Host role="toolbar" aria-orientation="horizontal">
        {this.renderSearchFilterActions()}
        {this.sectionSpacing()}
        {this.renderContextualPermanentPrimary()}
      </Host>
    ) as JSX.Element;
  }
}

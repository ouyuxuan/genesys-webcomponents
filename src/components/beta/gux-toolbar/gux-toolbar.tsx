import { Component, Element, JSX, h, Host, readTask } from '@stencil/core';

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

  private resizeOberser?: ResizeObserver;

  private renderSearchFilterActions(): JSX.Element {
    return (<slot name="searchFilter" />) as JSX.Element;
  }

  private layoutChange(): JSX.Element {
    return (<div class="layout-container">flex</div>) as JSX.Element;
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

  private checkToolBarWidthForLayout() {
    readTask(() => {
      const el = this.root.shadowRoot.querySelector('.layout-container');
      const layoutContainerWidth = el.clientWidth;
      if (layoutContainerWidth < MIN_SPACING) {
        //emit event here.
      } else {
        //emit event here ??
      }
    });
  }

  componentDidLoad() {
    if (!this.resizeOberser && window.ResizeObserver) {
      this.resizeOberser = new ResizeObserver(() => {
        this.checkToolBarWidthForLayout();
      });
    }

    if (this.resizeOberser) {
      this.resizeOberser.observe(
        this.root.shadowRoot.querySelector('.layout-container')
      );
    }
  }

  disconnectedCallback() {
    if (this.resizeOberser) {
      this.resizeOberser.unobserve(
        this.root.shadowRoot.querySelector('.layout-container')
      );
    }
  }

  render(): JSX.Element {
    return (
      <Host role="toolbar" aria-orientation="horizontal">
        {this.renderSearchFilterActions()}
        {this.layoutChange()}
        {this.renderContextualPermanentPrimary()}
      </Host>
    ) as JSX.Element;
  }
}

import { Component, Element, State, JSX, h } from '@stencil/core';
import { trackComponent } from '../../../../usage-tracking';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';

import translationResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-toolbar-action.less',
  tag: 'gux-toolbar-action',
  shadow: true
})
export class GuxToolbarAction {
  private i18n: GetI18nValue;

  /**
   * Reference to the host element.
   */
  @Element()
  root: HTMLElement;

  @State()
  label: string;

  private onSlotChange(event: Event) {
    const slotAssignedNodes = (
      event.composedPath()[0] as HTMLSlotElement
    ).assignedNodes();
    this.label = slotAssignedNodes
      .map(nodeItem => nodeItem.textContent)
      .join('');
  }

  private renderFilterTitle(): JSX.Element {
    return (
      <gux-tooltip-title>
        <span>
          <slot
            aria-hidden="true"
            onSlotchange={this.onSlotChange.bind(this)}
          />
        </span>
      </gux-tooltip-title>
    ) as JSX.Element;
  }

  private renderSrText(): JSX.Element {
    return (
      <div class="gux-sr-only">
        {this.i18n('action', {
          label: this.label
        })}
      </div>
    ) as JSX.Element;
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);
  }
}

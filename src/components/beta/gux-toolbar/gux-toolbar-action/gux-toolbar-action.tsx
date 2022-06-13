import { Component, Element, State, JSX, h, Prop } from '@stencil/core';
import { trackComponent } from '../../../../usage-tracking';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';

import translationResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-toolbar-action.less',
  tag: 'gux-toolbar-action'
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

  @Prop()
  primary: boolean;

  @Prop()
  icon: string;

  private onSlotChange(event: Event) {
    const slotAssignedNodes = (
      event.composedPath()[0] as HTMLSlotElement
    ).assignedNodes();
    this.label = slotAssignedNodes
      .map(nodeItem => nodeItem.textContent)
      .join('');
  }

  private renderActionTitle(): JSX.Element {
    return (
      <slot aria-hidden="true" onSlotchange={this.onSlotChange.bind(this)} />
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

  render(): JSX.Element {
    return (
      <button
        class={{
          'gux-toolbar-action': true,
          'gux-toolbar-action-primary': this.primary
        }}
      >
        {this.renderActionTitle()}
        {this.renderSrText()}
      </button>
    ) as JSX.Element;
  }
}

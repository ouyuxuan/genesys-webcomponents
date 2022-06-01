import { Component, h, JSX, State, Host } from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { getRootIconName } from '../../../stable/gux-icon/gux-icon.service';
import tableResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-header-sortable.less',
  tag: 'gux-header-sortable',
  shadow: true
})
export class GuxHeaderSortable {
  private i18n: GetI18nValue;
  /* Reference Host Element */
  root: HTMLElement;

  /* Label to indicate column text content */
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

  private renderSrText(): JSX.Element {
    return (
      <div class="gux-sr-only">
        {this.i18n('colSortDirection', {
          label: this.label
        })}
      </div>
    ) as JSX.Element;
  }

  async componentWillRender(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
  }

  render(): JSX.Element {
    return (
      <Host>
        <button type="button">{this.renderSrText()}</button>
        <span aria-hidden="true">
          <slot onSlotchange={this.onSlotChange.bind(this)} />
        </span>
      </Host>
    ) as JSX.Element;
  }
}

import { Component, h, Host, JSX, State, Listen } from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { GuxTableSortState } from '../gux-table.types';
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
  colLabel: string;

  /* State to store direction of sort */
  @State()
  colSortDirection: string;

  /* Listen to guxsortchanged event to retrieve sort direction */
  @Listen('guxsortchanged', { target: 'body' })
  sortDirectionEvent(event: CustomEvent<GuxTableSortState>) {
    this.colSortDirection = event.detail.sortDirection;
  }

  private onSlotChange(event: Event) {
    const slotAssignedNodes = (
      event.composedPath()[0] as HTMLSlotElement
    ).assignedNodes();
    this.colLabel = slotAssignedNodes
      .map(nodeItem => nodeItem.textContent)
      .join('');
  }

  private renderSrText(): JSX.Element {
    return (
      <div class="gux-sr-only">
        {this.i18n('colSortDirection', {
          colLabel: this.colLabel,
          colSortDirection: this.colSortDirection
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

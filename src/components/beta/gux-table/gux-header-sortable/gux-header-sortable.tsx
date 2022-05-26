import { Component, h, JSX, Prop, State, Host } from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import tableResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-header-sortable.less',
  tag: 'gux-header-sortable'
})
export class GuxHeaderSortable {
  private i18n: GetI18nValue;
  /* Reference Host Element */
  root: HTMLElement;

  /* Indicate the direction of the sort */
  @Prop()
  sortDirection: string;

  /* Indicate data column name */
  @Prop()
  dataColName: string;

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
        {this.i18n('th', {
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
      <th
        role="columnheader"
        aria-sort={this.sortDirection}
        scope="col"
        data-column-name={this.dataColName}
        data-sortable
        data-sort={this.sortDirection}
      >
        <button type="button">
          <slot onSlotchange={this.onSlotChange.bind(this)} />
        </button>
        {this.renderSrText()}
      </th>
    ) as JSX.Element;
  }
}

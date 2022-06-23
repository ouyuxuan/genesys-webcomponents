import {
  Component,
  h,
  Host,
  JSX,
  State,
  Listen,
  Element,
  getAssetPath
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { GuxTableSortState } from '../gux-table.types';
import tableResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-sort-control.less',
  tag: 'gux-sort-control',
  shadow: true
})
export class GuxSortControl {
  private i18n: GetI18nValue;
  /* Reference Host Element */
  @Element() root: HTMLElement;

  /* State label to indicate column text content */
  @State()
  colLabel: string;

  /* State label to store direction of sort */
  @State()
  colSortDirection: string;

  @Listen('guxsortchanged', { target: 'body' })
  sortDirectionEvent(event: CustomEvent<GuxTableSortState>) {
    this.colSortDirection = event.detail.sortDirection;
    this.colLabel = event.detail.columnName;
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

  /* Styles can bet static as we need asset path to generate URL */
  private prepareSortableStyles(): void {
    const styleId = 'gux-table-sort-control-styles';
    if (document.getElementById(styleId) == null) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;

      const ascArrowIcon = getAssetPath(`icons/arrow-solid-down.svg`);
      const descArrowIcon = getAssetPath(`icons/arrow-solid-up.svg`);

      styleElement.innerHTML = `
      .gux-ascending {background-image:url("${ascArrowIcon}"); float: right; display:block; width: 16px; height: 16px;}
      .gux-descending {background-image:url("${descArrowIcon}"); float: right; display:block; width: 16px; height: 16px;}
      `;

      document.querySelector('gux-sort-control').prepend(styleElement);
    }
  }

  async componentWillRender(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
  }

  componentWillLoad() {
    this.prepareSortableStyles();
  }

  componentDidLoad() {
    this.colLabel = this.root.closest('th').getAttribute('data-column-name');
    this.colSortDirection = this.root.closest('th').getAttribute('aria-sort');
  }
  render(): JSX.Element {
    return (
      <Host>
        <button type="button">
          <span
            aria-hidden="true"
            class={{ [`gux-${this.colSortDirection}`]: true }}
          >
            {' '}
          </span>
          {this.renderSrText()}
        </button>
      </Host>
    ) as JSX.Element;
  }
}

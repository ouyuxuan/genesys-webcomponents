import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Method,
  Listen,
  Prop,
  State
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { getDesiredLocale } from '../../../i18n';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';

@Component({
  styleUrl: 'gux-month-calendar.less',
  tag: 'gux-month-calendar-beta',
  shadow: true
})
export class GuxMonthCalendar {
  @Element()
  root: HTMLElement;

  /**
   * The current selected month
   */
  @Prop({ mutable: true })
  value: string = '';

  /**
   * The min month selectable
   */
  @Prop()
  minMonth: string = '';

  /**
   * The max month selectable
   */
  @Prop()
  maxMonth: string = '';

  /**
   * The min year selectable
   */
  @Prop()
  minYear: string = '';

  /**
   * The max year selectable
   */
  @Prop()
  maxYear: string = '';

  @Prop({ mutable: true })
  lastPickedMonth: HTMLElement;

  @State()
  yearLabel: string = '';

  @State()
  previewValue: string = '';

  @State()
  monthsListLong: Array<string> = [];

  @State()
  monthsListShort: Array<string> = [];

  @Prop()
  monthsObject: object = {};

  @Prop()
  monthsObjectShort: object = {};

  @State()
  focused: boolean = false;

  /**
   * Triggered when user selects a month
   */
  @Event()
  input: EventEmitter<string>;

  private locale: string = 'en';

  emitInput() {
    this.input.emit(this.value);
  }

  componentWillLoad() {
    trackComponent(this.root);
    this.locale = getDesiredLocale(this.root);

    if (!this.value) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleString(this.locale, { month: 'long' });
      const monthNameFormatted = month.charAt(0).toUpperCase() + month.slice(1);
      this.value = `${monthNameFormatted} ${year}`;
    }

    this.yearLabel = this.value.split(' ')[1];
    this.previewValue = this.value;
    this.getMonths();
  }

  componentDidLoad() {
    setTimeout(() => {
      void this.focusPreviewMonth();
    });
  }

  /**
   * Sets new value and rerender the calendar
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async setValue(month: string, year: string) {
    const value = `${month} ${year}`;
    this.value = value;
    this.previewValue = value;
  }

  /**
   * Focus the preview month
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async focusPreviewMonth() {
    const shortMonth = this.monthsObjectShort[this.previewValue.split(' ')[0]];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const id = shortMonth ? shortMonth.name : this.previewValue.split(' ')[0];

    const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `td[id="${id}"]`
    );

    if (target) {
      if (this.lastPickedMonth) {
        this.lastPickedMonth.classList.remove('gux-selected');
        this.lastPickedMonth.tabIndex = -1;
      }

      if (!this.focused) {
        target.classList.add('gux-selected');
      }

      target.tabIndex = 0;
      target.focus();
      this.lastPickedMonth = target;
    }
  }

  /**
   * Reset calendar view to show first selected date
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async resetCalendarView(value: string): Promise<void> {
    this.previewValue = value;
  }

  incrementPreviewDateByYear(increment: number) {
    this.yearLabel = (parseInt(this.yearLabel) + increment).toString();

    const guxRightButton =
      this.root.shadowRoot.querySelector('button.gux-right');
    const guxLeftButton = this.root.shadowRoot.querySelector('button.gux-left');

    if (parseInt(this.yearLabel) === parseInt(this.maxYear)) {
      guxRightButton.setAttribute('disabled', 'true');
    } else if (parseInt(this.yearLabel) === parseInt(this.minYear)) {
      guxLeftButton.setAttribute('disabled', 'true');
    } else {
      if (guxRightButton && guxRightButton.hasAttribute('disabled')) {
        guxRightButton.removeAttribute('disabled');
      }

      if (guxLeftButton && guxLeftButton.hasAttribute('disabled')) {
        guxLeftButton.removeAttribute('disabled');
      }
    }

    this.getDisabledMonths();
  }

  async setValueAndEmit(month: string, year: string) {
    await this.setValue(month, year);
    this.emitInput();
  }

  private outOfBounds(month: string, year: string): boolean {
    return (
      (this.maxMonth !== '' && this.maxMonth < month) ||
      (this.maxYear !== '' && this.maxYear < year) ||
      (this.minMonth !== '' && this.minMonth > month) ||
      (this.minYear !== '' && this.minYear > year)
    );
  }

  async onMonthClick(month: string, year: string) {
    if (!this.outOfBounds(this.monthsListLong[month] as string, year)) {
      if (this.lastPickedMonth) {
        this.lastPickedMonth.classList.remove('gux-selected');
      }
      await this.setValueAndEmit(month, year);
      const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
        `td[id="${month}"]`
      );
      if (target) {
        target.classList.add('gux-selected');
      }
      this.lastPickedMonth = target;
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.focused = false;
  }

  getMonths() {
    // January
    const month = new Date(1970, 0);

    for (let i = 0; i < 12; i++) {
      const monthNameLong = month.toLocaleString(this.locale, {
        month: 'long'
      });
      const monthNameShort = month.toLocaleString(this.locale, {
        month: 'short'
      });
      const monthNameLongFormatted =
        monthNameLong.charAt(0).toUpperCase() + monthNameLong.slice(1);
      const monthNameShortFormatted =
        monthNameShort.charAt(0).toUpperCase() + monthNameShort.slice(1);
      this.monthsListLong.push(monthNameLongFormatted);
      this.monthsListShort.push(monthNameShortFormatted);
      this.monthsObject[monthNameShortFormatted] = {
        name: monthNameLongFormatted,
        index: i
      };
      this.monthsObjectShort[monthNameLongFormatted] = {
        name: monthNameShortFormatted,
        index: i
      };
      month.setMonth(month.getMonth() + 1);
    }
  }

  /**
   * Disables months out of specified range
   */
  getDisabledMonths() {
    for (let i = 0; i < 12; i++) {
      if (this.root.shadowRoot.querySelector(`td.${this.monthsListShort[i]}`)) {
        this.root.shadowRoot
          .querySelector(`td.${this.monthsListShort[i]}`)
          .classList.remove('gux-disabled');
      }

      // min
      if (this.yearLabel === this.minYear) {
        if (this.minMonth === this.monthsListLong[i]) {
          this.root.shadowRoot
            .querySelector(`td.${this.monthsListShort[i]}`)
            .classList.add('gux-disabled');

          // disable previous months
          for (let j = i - 1; j >= 0; j--) {
            this.root.shadowRoot
              .querySelector(`td.${this.monthsListShort[j]}`)
              .classList.add('gux-disabled');
          }
        }
      }

      // max
      if (this.yearLabel === this.maxYear) {
        if (this.maxMonth === this.monthsListLong[i]) {
          this.root.shadowRoot
            .querySelector(`td.${this.monthsListShort[i]}`)
            .classList.add('gux-disabled');

          // disable future months
          for (let k = i + 1; k < 12; k++) {
            this.root.shadowRoot
              .querySelector(`td.${this.monthsListShort[k]}`)
              .classList.add('gux-disabled');
          }

          i = 12;
        }
      }
    }
  }

  private onArrowKeyDown(month: Date) {
    const monthName = month.toLocaleString(this.locale, { month: 'short' });
    const monthNameFormatted =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);
    this.previewValue = `${monthNameFormatted} ${this.yearLabel}`;
    setTimeout(() => {
      void this.focusPreviewMonth();
    });
  }

  @Listen('keydown')
  async onKeyDown(event: KeyboardEvent) {
    const previewValue = this.previewValue.split(' ');
    const getMonth = this.monthsObjectShort[previewValue[0]]
      ? this.monthsObjectShort[previewValue[0]]
      : this.monthsObject[previewValue[0]];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const month = new Date(parseInt(this.yearLabel), getMonth.index as number);

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        await this.onMonthClick(previewValue[0], previewValue[1]);
        break;
      case 'ArrowDown':
        event.preventDefault();
        month.setMonth(month.getMonth() + 3);
        this.onArrowKeyDown(month);
        this.focused = true;
        break;
      case 'ArrowUp':
        event.preventDefault();
        month.setMonth(month.getMonth() - 3);
        this.onArrowKeyDown(month);
        this.focused = true;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        month.setMonth(month.getMonth() - 1);
        this.onArrowKeyDown(month);
        this.focused = true;
        break;
      case 'ArrowRight':
        event.preventDefault();
        month.setMonth(month.getMonth() + 1);
        this.onArrowKeyDown(month);
        this.focused = true;
        break;
    }
  }

  renderCalendarTable() {
    return (
      <table>
        <tr>
          {[
            this.monthsListShort[0],
            this.monthsListShort[1],
            this.monthsListShort[2]
          ].map(
            month =>
              (
                <td
                  id={month}
                  class={month}
                  onClick={() => this.onMonthClick(month, this.yearLabel)}
                >
                  {month}{' '}
                  <span class="gux-sr-only">
                    {month} {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {[
            this.monthsListShort[3],
            this.monthsListShort[4],
            this.monthsListShort[5]
          ].map(
            month =>
              (
                <td
                  id={month}
                  class={month}
                  onClick={() => this.onMonthClick(month, this.yearLabel)}
                >
                  {month}{' '}
                  <span class="gux-sr-only">
                    {month} {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {[
            this.monthsListShort[6],
            this.monthsListShort[7],
            this.monthsListShort[8]
          ].map(
            month =>
              (
                <td
                  id={month}
                  class={month}
                  onClick={() => this.onMonthClick(month, this.yearLabel)}
                >
                  {month}{' '}
                  <span class="gux-sr-only">
                    {month} {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {[
            this.monthsListShort[9],
            this.monthsListShort[10],
            this.monthsListShort[11]
          ].map(
            month =>
              (
                <td
                  id={month}
                  class={month}
                  onClick={() => this.onMonthClick(month, this.yearLabel)}
                >
                  {month}{' '}
                  <span class="gux-sr-only">
                    {month} {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
      </table>
    ) as JSX.Element;
  }

  render() {
    return (
      <div class="gux-month-calendar">
        <div class="gux-header">
          <button
            type="button"
            class="gux-left"
            onClick={() => this.incrementPreviewDateByYear(-1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative icon-name="chevron-small-left"></gux-icon>
          </button>
          <div class="gux-year-list">
            <label>{this.yearLabel}</label>
          </div>
          <button
            type="button"
            class="gux-right"
            onClick={() => this.incrementPreviewDateByYear(1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative icon-name="chevron-small-right"></gux-icon>
          </button>
        </div>
        <div class="gux-content">{this.renderCalendarTable()}</div>
      </div>
    ) as JSX.Element;
  }
}

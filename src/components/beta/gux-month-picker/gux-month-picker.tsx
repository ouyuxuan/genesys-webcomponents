/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Watch,
  Prop,
  State
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';
import { getDesiredLocale } from '../../../i18n';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import translationResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-month-picker.less',
  tag: 'gux-month-picker-beta',
  shadow: true
})
export class GuxMonthPicker {
  i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;
  monthCalendarElement: HTMLGuxMonthCalendarBetaElement;

  /**
   * The month picker current value
   */
  @Prop({ mutable: true })
  value: string = '';

  /**
   * Indicate if the month picker is disabled or not
   */
  @Prop()
  disabled: boolean = false;

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

  @State()
  active: boolean = false;

  /**
   * Triggered when user selects a month
   */
  @Event()
  input: EventEmitter<string>;

  private locale: string = 'en';

  async componentWillLoad() {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);

    this.locale = getDesiredLocale(this.root);

    if (!this.value) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleString(this.locale, { month: 'long' });
      const monthNameFormatted = month.charAt(0).toUpperCase() + month.slice(1);
      this.value = `${monthNameFormatted} ${year}`;
    }
  }

  toggleCalendar() {
    this.active = !this.active;
    if (this.active) {
      // Wait for render before focusing preview date
      setTimeout(() => {
        void this.monthCalendarElement.focusPreviewMonth();
      }, 100);
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.active = false;
  }

  @Watch('active')
  watchActiveCalendar(active: boolean) {
    if (active) {
      void this.monthCalendarElement.resetCalendarView(this.value);
    }
  }

  onMonthCalendarSelect(inputEvent: Event) {
    const monthCalendar = inputEvent.target as HTMLGuxMonthCalendarBetaElement;
    const value = monthCalendar.value.split(' ');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.value = monthCalendar.monthsObject[value[0]]
      ? `${monthCalendar.monthsObject[value[0]].name} ${value[1]}`
      : this.value;
    inputEvent.stopPropagation(); // Don't let both events bubble.
    this.input.emit(this.value);
    this.active = false;
  }

  renderCalendarToggleButton(): JSX.Element {
    return (
      <button
        class="gux-calendar-toggle-button"
        type="button"
        disabled={this.disabled}
        aria-label={this.i18n('toggleCalendar')}
      >
        <gux-icon decorative icon-name="calendar"></gux-icon>
      </button>
    ) as JSX.Element;
  }

  renderCalendar(): JSX.Element {
    return (
      <gux-month-calendar-beta
        ref={(el: HTMLGuxMonthCalendarBetaElement) =>
          (this.monthCalendarElement = el)
        }
        onInput={(event: CustomEvent) => this.onMonthCalendarSelect(event)}
        value={this.value}
        minMonth={this.minMonth}
        minYear={this.minYear}
        maxMonth={this.maxMonth}
        maxYear={this.maxYear}
      />
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-month-picker-beta': true,
          'gux-active': this.active,
          'gux-disabled': this.disabled
        }}
      >
        <div class="gux-month-picker" onClick={() => this.toggleCalendar()}>
          <span class="gux-month-display" aria-label={this.value}>
            {this.value}
          </span>
          {this.renderCalendarToggleButton()}
        </div>
        {this.renderCalendar()}
      </div>
    ) as JSX.Element;
  }
}

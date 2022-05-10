import { Component, Element, h, JSX, Listen, Prop, State } from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import componentResources from './i18n/en.json';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';
import { whenEventIsFrom } from '../../../../../utils/dom/when-event-is-from';
import { OnClickOutside } from '../../../../../utils/decorator/on-click-outside';
import { OnMutation } from '../../../../../utils/decorator/on-mutation';
import { trackComponent } from '../../../../../usage-tracking';
import { preventBrowserValidationStyling } from '../../../../../utils/dom/prevent-browser-validation-styling';

import { GuxFormFieldContainer } from '../../functional-components/gux-form-field-container/gux-form-field-container';
import { GuxFormFieldError } from '../../functional-components/gux-form-field-error/gux-form-field-error';
import { GuxFormFieldLabel } from '../../functional-components/gux-form-field-label/gux-form-field-label';

import {
  Gux15MinuteInterval12h,
  Gux30MinuteInterval12h,
  Gux60MinuteInterval12h,
  Gux15MinuteInterval24h,
  Gux30MinuteInterval24h,
  Gux60MinuteInterval24h
} from './gux-form-field-timepicker-suggested-times';
import { GuxInterval } from './gux-form-field-timepicker.types';
import { GuxFormFieldLabelPosition } from '../../gux-form-field.types';
import {
  hasErrorSlot,
  getComputedLabelPosition,
  validateFormIds
} from '../../gux-form-field.servce';

const MAX_HOURS_12H: string = '12';
const MIN_HOURS_12H: string = '1';
const MAX_HOURS_24H: string = '23';
const MIN_HOURS_24H: string = '00';
const MAX_MINUTES: string = '59';
const MIN_MINUTES: string = '00';

/**
 * @slot input - Required slot for input tag
 * @slot label - Optional slot for label tag
 * @slot error - Optional slot for error message
 */
@Component({
  styleUrl: 'gux-form-field-timepicker.less',
  tag: 'gux-form-field-timepicker-beta',
  shadow: true
})
export class GuxFormFieldTimepicker {
  private i18n: GetI18nValue;
  private input: HTMLInputElement;
  private label: HTMLLabelElement;
  private disabledObserver: MutationObserver;

  private inputHoursElement: HTMLInputElement;
  private inputMinutesElement: HTMLInputElement;

  @Element()
  private root: HTMLElement;

  @Prop()
  labelPosition: GuxFormFieldLabelPosition;

  @State()
  private computedLabelPosition: GuxFormFieldLabelPosition = 'above';

  /**
   * User's locale for 12h or 24h time format
   */
  @Prop({ mutable: true })
  timeFormat: string = '12h';

  /**
   * AM/PM toggle value
   */
  @Prop({ mutable: true })
  toggleAmPMValue: string = '';

  /**
   * Suggested times dropdown list state - opened/closed
   */
  @Prop({ mutable: true })
  opened: boolean = false;

  /**
   * Indicate the dropdown input value
   */
  @Prop({ mutable: true })
  dropdownValue: string = '';

  /**
   * Hours input value
   */
  @Prop({ mutable: true })
  hoursValue: string = '12';

  /**
   * Minutes input value
   */
  @Prop({ mutable: true })
  minutesValue: string = '00';

  /**
   * Time interval between suggested times in dropdown list - default 60
   */
  @Prop()
  interval: GuxInterval = '60';

  /**
   * True when suggested time option is selected
   */
  @Prop()
  optionSelected: boolean = false;

  @State()
  clockActive: boolean = false;

  @State()
  private disabled: boolean;

  @State()
  private hasError: boolean = false;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.hasError = hasErrorSlot(this.root);
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, componentResources);
    this.input = this.root.querySelector('input[slot="input"]');
    this.toggleAmPMValue = this.i18n('am');
    this.disabled = this.input.disabled;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    this.setInput();
    this.setLabel();
    this.hasError = hasErrorSlot(this.root);

    const lang = this.root.lang;
    let userCurrentTime = '';
    if (lang) {
      userCurrentTime = new Date().toLocaleTimeString(lang);
    } else {
      userCurrentTime = new Date().toLocaleTimeString();
    }

    if (
      !userCurrentTime.includes(this.i18n('am')) &&
      !userCurrentTime.includes(this.i18n('pm'))
    ) {
      this.timeFormat = '24h';
    }

    if (this.timeFormat === '24h') {
      this.hoursValue = '00';
    }

    trackComponent(this.root);
  }

  @Listen('keydown', { passive: false })
  onKeyDown(event: KeyboardEvent) {
    const selectionOptions = this.getTimeOptions();
    const focusIndex = this.getFocusIndex(selectionOptions);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (this.clockActive) {
          if (focusIndex < selectionOptions.length - 1) {
            selectionOptions[focusIndex + 1].focus();
          } else {
            selectionOptions[0].focus();
          }
        } else {
          this.increment(-1, event);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();

        if (this.clockActive) {
          if (focusIndex > 0) {
            selectionOptions[focusIndex - 1].focus();
          } else {
            selectionOptions[selectionOptions.length - 1].focus();
          }
        } else {
          this.increment(1, event);
        }
        break;
      case 'Tab':
        if (this.clockActive) {
          this.opened = false;
        }
        break;
      case 'Enter':
        if (this.clockActive) {
          this.optionSelectedHandler(event, true);
        }
        break;
      default:
        break;
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside(e: MouseEvent) {
    if (!e.relatedTarget || !this.root.contains(e.relatedTarget as Node)) {
      this.opened = false;
      this.clockActive = false;
    }
  }

  private getFocusIndex(selectionOptions: HTMLGuxOptionElement[]): number {
    return selectionOptions.findIndex(option => {
      return option.matches(':focus');
    });
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
  }

  private setLabel(): void {
    this.label = this.root.querySelector('label[slot="label"]');

    this.computedLabelPosition = getComputedLabelPosition(
      this.label,
      this.labelPosition
    );
  }

  /**
   * For clock button open/close of dropdown list
   */
  private toggle() {
    if (this.opened === false) {
      this.clockActive = true;
    }
    this.opened = !this.opened;
  }

  setValue(value: string) {
    this.dropdownValue = value;
    this.opened = false;
  }

  /**
   * Create list of suggested times
   */
  suggestedTimesList() {
    const arrListItems = [];

    let timeFormat15MinuteIntervalList = Gux15MinuteInterval12h;
    let timeFormat30MinuteIntervalList = Gux30MinuteInterval12h;
    let timeFormat60MinuteIntervalList = Gux60MinuteInterval12h;
    if (this.timeFormat === '24h') {
      timeFormat15MinuteIntervalList = Gux15MinuteInterval24h;
      timeFormat30MinuteIntervalList = Gux30MinuteInterval24h;
      timeFormat60MinuteIntervalList = Gux60MinuteInterval24h;
    }

    if (this.interval === '15') {
      timeFormat15MinuteIntervalList.forEach(time => {
        arrListItems.push(
          <gux-option
            tabindex="0"
            class="gux-time-option"
            title={time}
            value={time}
          >
            {time}
          </gux-option>
        );
      });
    } else if (this.interval === '30') {
      timeFormat30MinuteIntervalList.forEach(time => {
        arrListItems.push(
          <gux-option
            tabindex="0"
            class="gux-time-option"
            title={time}
            value={time}
          >
            {time}
          </gux-option>
        );
      });
    } else {
      timeFormat60MinuteIntervalList.forEach(time => {
        arrListItems.push(
          <gux-option
            tabindex="0"
            class="gux-time-option"
            title={time}
            value={time}
          >
            {time}
          </gux-option>
        );
      });
    }

    return (
      <div class="gux-time-options-list">{arrListItems}</div>
    ) as JSX.Element;
  }

  /**
   * Get time options for suggested times
   */
  private getTimeOptions(): HTMLGuxOptionElement[] {
    const result: HTMLGuxOptionElement[] = [];
    const options: HTMLElement = this.input.getElementsByClassName(
      'gux-time-options'
    )[0] as HTMLElement;

    if (!options) {
      return [];
    }

    const childrenElements = Array.from(options.children[0].children);
    childrenElements.forEach(child => {
      if (child.matches('gux-option')) {
        result.push(child as HTMLGuxOptionElement);
      }
    });

    return result;
  }

  /**
   * Set hours and minutes value when suggested option is selected
   * @param e - option selected event
   */
  private optionSelectedHandler(e: Event, fromEnterKeyPress: boolean = false) {
    if (fromEnterKeyPress) {
      const option = e.composedPath()[0] as HTMLGuxOptionElement;
      const selectionOptions = this.getTimeOptions();

      selectionOptions.forEach(selectionOption => {
        if (selectionOption === option) {
          this.setValue(selectionOption.value);
        }
      });
    }

    whenEventIsFrom('gux-option', e, elem => {
      const option = elem as HTMLGuxOptionElement;
      const selectionOptions = this.getTimeOptions();

      selectionOptions.forEach(selectionOption => {
        if (selectionOption === option) {
          this.setValue(selectionOption.value);
        }
      });
    });

    this.getHoursMinutesNewValue();
    this.clockActive = false;
  }

  getHoursMinutesNewValue() {
    if (this.dropdownValue != '') {
      const splitValue = this.dropdownValue.split(':');
      this.hoursValue = splitValue[0];
      this.minutesValue = splitValue[1];
    }
  }

  /**
   * Increment (or decrement) hours/minutes input value when using keyboard up/down keys
   * @param delta - number to increment or decrement value by
   * @param e - mouse click event
   */
  increment(delta: number, e: Event) {
    const target = e.composedPath()[0] as HTMLElement;
    const targetInput = target.className;
    let targetValue = '';

    let timeFormatMaxHours = MAX_HOURS_12H;
    let timeFormatMinHours = MIN_HOURS_12H;
    if (this.timeFormat === '24h') {
      timeFormatMaxHours = MAX_HOURS_24H;
      timeFormatMinHours = MIN_HOURS_24H;
    }

    if (targetInput === 'gux-input-time-hours') {
      targetValue = this.hoursValue;
      if (delta === 1) {
        if (targetValue === timeFormatMaxHours) {
          this.hoursValue = timeFormatMinHours;
        } else {
          this.hoursValue = (parseInt(targetValue) + 1).toString();
        }
      }

      if (delta === -1) {
        if (targetValue === timeFormatMinHours) {
          this.hoursValue = timeFormatMaxHours;
        } else {
          this.hoursValue = (parseInt(targetValue) - 1).toString();
        }
      }
    }

    if (targetInput === 'gux-input-time-minutes') {
      targetValue = this.minutesValue;
      if (delta === 1) {
        if (targetValue === MAX_MINUTES) {
          this.minutesValue = MIN_MINUTES;
        } else {
          this.minutesValue = (parseInt(targetValue) + 1).toString();
        }
      }

      if (delta === -1) {
        if (targetValue === MIN_MINUTES) {
          this.minutesValue = MAX_MINUTES;
        } else {
          this.minutesValue = (parseInt(targetValue) - 1).toString();
        }
      }

      if (this.minutesValue.length < 2) {
        this.minutesValue = '0' + this.minutesValue;
      }
    }
  }

  onHoursChanged(inputHoursElement: HTMLInputElement) {
    const hoursValue = inputHoursElement.value.replace(/\s/g, '');

    let timeFormatMaxHours = MAX_HOURS_12H;
    let timeFormatMinHours = MIN_HOURS_12H;
    if (this.timeFormat === '24h') {
      timeFormatMaxHours = MAX_HOURS_24H;
      timeFormatMinHours = MIN_HOURS_24H;
    }

    if (
      parseInt(hoursValue) <= parseInt(timeFormatMaxHours) &&
      parseInt(hoursValue) >= parseInt(timeFormatMinHours)
    ) {
      this.hoursValue = hoursValue;
    } else if (
      parseInt(hoursValue) > parseInt(timeFormatMaxHours) ||
      parseInt(hoursValue) < parseInt(timeFormatMinHours)
    ) {
      if (this.timeFormat === '24h') {
        this.hoursValue = MIN_HOURS_24H;
      } else {
        // 12 Hour
        this.hoursValue = MAX_HOURS_12H;
      }
    } else if (hoursValue.length < 1) {
      if (this.timeFormat === '24h') {
        this.hoursValue = MIN_HOURS_24H;
      } else {
        // 12 Hour
        this.hoursValue = MAX_HOURS_12H;
      }
    } else {
      if (this.timeFormat === '24h') {
        this.hoursValue = MIN_HOURS_24H;
      } else {
        // 12 Hour
        this.hoursValue = MAX_HOURS_12H;
      }
    }

    this.input.value = this.hoursValue;
  }

  onMinutesChanged(inputMinutesElement: HTMLInputElement) {
    const minutesValue = inputMinutesElement.value.replace(/\s/g, '');

    if (
      parseInt(minutesValue) > parseInt(MAX_MINUTES) ||
      parseInt(minutesValue) < parseInt(MIN_MINUTES)
    ) {
      this.minutesValue = MIN_MINUTES;
    } else if (minutesValue.length < 1) {
      this.minutesValue = MIN_MINUTES;
    } else if (minutesValue.length < 2) {
      this.minutesValue = '0' + minutesValue;
    } else {
      this.minutesValue = minutesValue;
    }

    this.input.value = this.minutesValue;
  }

  onAmPmSelectorClicked() {
    if (this.toggleAmPMValue === this.i18n('am')) {
      this.toggleAmPMValue = this.i18n('pm');
    } else {
      this.toggleAmPMValue = this.i18n('am');
    }
  }

  renderAmPmSelector(): JSX.Element {
    if (this.timeFormat === '24h') {
      return;
    } else {
      // 12h format
      return (
        <button
          class="gux-input-time-am-pm-selector"
          type="button"
          disabled={this.disabled}
          aria-label={this.i18n('toggleAmPM', { amOrPm: this.toggleAmPMValue })}
          onClick={() => this.onAmPmSelectorClicked()}
        >
          {this.toggleAmPMValue}
        </button>
      ) as JSX.Element;
    }
  }

  renderClockButton(): JSX.Element {
    return (
      <button
        class={{
          'gux-clock-button': true,
          'gux-active': this.clockActive
        }}
        type="button"
        disabled={this.disabled}
        aria-label={this.i18n('clockButton')}
        onClick={this.toggle.bind(this)}
      >
        <gux-icon decorative icon-name="clock-outline"></gux-icon>
      </button>
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (
      <GuxFormFieldContainer labelPosition={this.computedLabelPosition}>
        <GuxFormFieldLabel
          position={this.computedLabelPosition}
          required={false}
        >
          <slot name="label" onSlotchange={() => this.setLabel()} />
        </GuxFormFieldLabel>
        <div class="gux-input-and-error-container">
          <div
            class={{
              'gux-input': true,
              'gux-input-error': this.hasError
            }}
          >
            <div
              class={{
                'gux-timepicker': true,
                'gux-disabled': this.disabled
              }}
              aria-disabled={this.disabled.toString()}
              ref={(el: HTMLInputElement) => (this.input = el)}
            >
              <div class="gux-input-time">
                <input
                  class="gux-input-time-hours"
                  type="number"
                  min={
                    this.timeFormat === '24h' ? MIN_HOURS_24H : MIN_HOURS_12H
                  }
                  max={
                    this.timeFormat === '24h' ? MAX_HOURS_24H : MAX_HOURS_12H
                  }
                  disabled={this.disabled}
                  value={this.hoursValue}
                  ref={ref => (this.inputHoursElement = ref)}
                  onChange={() => this.onHoursChanged(this.inputHoursElement)}
                  aria-label={this.i18n('hoursInput')}
                />
                <span
                  class={{
                    'gux-time-separator': true,
                    'gux-disabled': this.disabled
                  }}
                >
                  {this.i18n('colon')}
                </span>
                <input
                  class="gux-input-time-minutes"
                  type="number"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  disabled={this.disabled}
                  value={this.minutesValue}
                  ref={ref => (this.inputMinutesElement = ref)}
                  onChange={() =>
                    this.onMinutesChanged(this.inputMinutesElement)
                  }
                  aria-label={this.i18n('minutesInput')}
                />
                {this.renderAmPmSelector()}
                {this.renderClockButton()}
              </div>
              <div
                class={{
                  'gux-time-options': true,
                  'gux-opened': this.opened,
                  'gux-disabled': this.disabled
                }}
                aria-label={this.i18n('timeOptionsState', {
                  state: this.opened.toString()
                })}
                onClick={this.optionSelectedHandler.bind(this)}
              >
                {this.suggestedTimesList()}
              </div>
            </div>
          </div>
          <GuxFormFieldError hasError={this.hasError}>
            <slot name="error" />
          </GuxFormFieldError>
        </div>
      </GuxFormFieldContainer>
    ) as JSX.Element;
  }

  private setInput(): void {
    this.input = this.root.querySelector('input[type="time"][slot="input"]');

    preventBrowserValidationStyling(this.input);

    this.disabled = this.input.disabled;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    validateFormIds(this.root, this.input);
  }
}

import {
  Component,
  Element,
  Event,
  h,
  JSX,
  Listen,
  Prop,
  State
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import componentResources from './i18n/en.json';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';
import { whenEventIsFrom } from '../../../../../utils/dom/when-event-is-from';
import { OnClickOutside } from '../../../../../utils/decorator/on-click-outside';
import {
  Gux15MinuteInterval,
  Gux30MinuteInterval
} from './gux-input-time-suggested-times';

const MAX_HOURS: string = '12';
const MAX_MINUTES: string = '59';
const MIN_HOURS: string = '1';
const MIN_MINUTES: string = '00';

/**
 * @slot input - Required slot for input[type="time"]
 */
@Component({
  styleUrl: 'gux-input-time.less',
  tag: 'gux-input-time'
})
export class GuxInputTime {
  private i18n: GetI18nValue;
  private input: HTMLInputElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  /**
   * AM/PM toggle value
   */
  @Prop({ mutable: true })
  toggleAmPMValue: string = '';

  /**
   * Suggested times dropdown list state - open/closed
   */
  @Prop({ mutable: true })
  opened: boolean = false;

  /**
   * Indicate the dropdown input value
   */
  @Prop({ mutable: true })
  value: string = '';

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
   * Time interval between suggested times in dropdown list
   */
  @Prop()
  interval: string = '15';

  @State()
  private disabled: boolean;

  @State()
  clockActive: boolean = false;

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, componentResources);
    this.input = this.root.querySelector('input[slot="input"]');

    this.disabled = this.input.disabled;
    this.toggleAmPMValue = this.i18n('am');

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );
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
      case 'Space':
        if (this.clockActive) {
          this.optionSelectedHandler(event);
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
    this.value = value;
    this.opened = false;
  }

  /**
   * Create list of suggested times
   */
  suggestedTimesList() {
    const arrListItems = [];
    if (this.interval != '15') {
      Gux30MinuteInterval.forEach(time => {
        arrListItems.push(
          <gux-option class="gux-time-option" value={time}>
            {time}
          </gux-option>
        );
      });
    } else {
      Gux15MinuteInterval.forEach(time => {
        arrListItems.push(
          <gux-option class="gux-time-option" value={time}>
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
    const options: HTMLElement = this.root.getElementsByClassName(
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
  private optionSelectedHandler(e: Event) {
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
    if (this.value != '') {
      const splitValue = this.value.split(':');
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
    const target = e.target as HTMLGuxInputTimeElement;
    const targetInput = target.className;
    const targetValue = target.value;

    if (targetInput === 'gux-input-time-hours') {
      if (delta === 1) {
        if (targetValue === MAX_HOURS) {
          this.hoursValue = MIN_HOURS;
        } else {
          this.hoursValue = (parseInt(targetValue) + 1).toString();
        }
      }

      if (delta === -1) {
        if (targetValue === MIN_HOURS) {
          this.hoursValue = MAX_HOURS;
        } else {
          this.hoursValue = (parseInt(targetValue) - 1).toString();
        }
      }
    }

    if (targetInput === 'gux-input-time-minutes') {
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

  onHoursChanged() {
    this.input = this.root.querySelector('.gux-input-time-hours');
    const hoursValue = this.input.value.replace(/\s/g, '');

    if (
      parseInt(hoursValue) <= parseInt(MAX_HOURS) &&
      parseInt(hoursValue) >= parseInt(MIN_HOURS)
    ) {
      this.hoursValue = hoursValue;
    } else if (
      parseInt(hoursValue) > parseInt(MAX_HOURS) ||
      parseInt(hoursValue) < parseInt(MIN_HOURS)
    ) {
      this.hoursValue = MAX_HOURS;
    } else if (hoursValue.length < 1) {
      // 12 Hour
      this.hoursValue = MAX_HOURS;
    } else {
      this.hoursValue = MAX_HOURS;
    }

    this.input.value = this.hoursValue;
  }

  onMinutesChanged() {
    this.input = this.root.querySelector('.gux-input-time-minutes');
    const minutesValue = this.input.value.replace(/\s/g, '');

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
      this.minutesValue = MIN_MINUTES;
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
      <div
        class={{
          'gux-input-time': true,
          'gux-disabled': this.disabled
        }}
        aria-disabled={this.disabled.toString()}
        ref={(el: HTMLInputElement) => (this.input = el)}
      >
        <div class="gux-input-time-field">
          <div class="gux-input-time-field-input">
            <div
              class={{
                'gux-input-time-field-text-input': true
              }}
            >
              <input
                class="gux-input-time-hours"
                type="number"
                min={MIN_HOURS}
                max={MAX_HOURS}
                disabled={this.disabled}
                value={this.hoursValue}
                onChange={this.onHoursChanged.bind(this)}
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
                onChange={this.onMinutesChanged.bind(this)}
                aria-label={this.i18n('minutesInput')}
              />
              {this.renderAmPmSelector()}
              {this.renderClockButton()}
            </div>
          </div>
        </div>
        <div
          class={{
            'gux-time-options': true,
            'gux-opened': this.opened,
            'gux-disabled': this.disabled
          }}
          aria-label="time options opened"
          onClick={this.optionSelectedHandler.bind(this)}
        >
          {this.suggestedTimesList()}
        </div>
      </div>
    ) as JSX.Element;
  }
}

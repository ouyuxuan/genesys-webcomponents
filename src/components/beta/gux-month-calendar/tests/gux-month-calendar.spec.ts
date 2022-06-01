import { GuxMonthCalendar } from '../gux-month-calendar';

describe('gux-month-calendar-beta', () => {
  let component: GuxMonthCalendar;
  let componentRoot: any;
  let componentShadowRoot: any;

  beforeEach(async () => {
    component = new GuxMonthCalendar();
    component.input = {
      emit: jest.fn()
    };
    componentRoot = component.root as any;
    componentShadowRoot = {} as any;
    componentRoot.shadowRoot = componentShadowRoot;

    componentShadowRoot.querySelector = () => {
      return null;
    };
    componentShadowRoot.querySelectorAll = () => {
      return [];
    };
  });
  it('builds', () => {
    component.componentWillLoad();
    component.render();
    expect(component).toBeTruthy();
  });
  // Methods
  describe('methods', () => {
    const testValue = 'January 2022';
    const month = 'January';
    const year = '2022';
    const spyEl = {
      classList: {
        add: jest.fn(),
        contains: () => false
      },
      focus: jest.fn(),
      setAttribute: jest.fn()
    };
    // Public
    describe('public', () => {
      it('setValue', async () => {
        await component.setValue(month, year);
        expect(component.previewValue).toEqual(testValue);
        expect(component.value).toEqual(testValue);
      });
      it('focusPreviewDate', async () => {
        await component.focusPreviewMonth();
        expect(spyEl.focus).not.toHaveBeenCalled();
        componentShadowRoot.querySelector = () => {
          return spyEl;
        };
        await component.focusPreviewMonth();
        expect(spyEl.focus).toHaveBeenCalled();
      });
    });
    // Private
    describe('private', () => {
      it('incrementPreviewDateByMonth', async () => {
        jest.useFakeTimers();
        await component.setValue(month, year);
        component.yearLabel = year;
        const startingYear = parseInt(component.yearLabel);
        component.incrementPreviewDateByYear(1);
        jest.runAllTimers();
        expect(component.yearLabel).toEqual((startingYear + 1).toString());
      });
      it('onMonthClick', async () => {
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.onMonthClick(month, year);
        expect(component.setValue).toHaveBeenCalledWith(month, year);
      });
      it('onKeyDown', async () => {
        jest.useFakeTimers();
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.setValue(month, year);
        component.getMonths();
        component.previewValue = 'Jan 2022';
        component.yearLabel = year;
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue).toEqual('Apr 2022');
        event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue).toEqual('May 2022');
        event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue).toEqual('Feb 2022');
        event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue).toEqual('Jan 2022');
        event = new KeyboardEvent('keydown', { key: 'Enter' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.setValue).toHaveBeenCalledTimes(2);
      });
      it('getMonths', () => {
        component.getMonths();
        expect(Object.keys(component.monthsObject).length).toEqual(12);
      });
    });
  });

  // Events
  describe('events', () => {
    it('onInput', () => {
      const value = 'January 2022';
      component.value = value;
      component.emitInput();
      expect(component.input.emit).toHaveBeenCalledWith(value);
    });
  });
});

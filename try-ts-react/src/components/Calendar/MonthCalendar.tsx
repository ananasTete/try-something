import { FC, ReactNode, useContext } from 'react';
import { ICalendarProps } from './Calendar.tsx';
import dayjs, { Dayjs } from 'dayjs';
import LocaleContext from './localeContext.tsx';
import allLocales from './locale/index.ts';
import classNames from 'classnames';

interface IMonthCalendarProps extends ICalendarProps {
  value: Dayjs;
  curMonth: Dayjs;
  selectHandler?: (date: Dayjs) => void;
}

type DateCellList = Array<{ date: Dayjs; currentMonth: boolean }>;

const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const ROW_COUNT = 6;
const COL_COUNT = 7;

function getAllDays(date: Dayjs) {
  const startDate = date.startOf('month');
  const day = startDate.day();

  const days: DateCellList = new Array(ROW_COUNT * COL_COUNT);

  for (let i = 0; i < day; i++) {
    days[i] = {
      currentMonth: false,
      date: startDate.subtract(day - i, 'day'),
    };
  }

  for (let i = day; i < days.length; i++) {
    const newDate = startDate.add(i - day, 'day');
    days[i] = {
      date: newDate,
      currentMonth: newDate.month() === date.month(),
    };
  }

  return days;
}

// 直接用 IMonthCalendarProps['dateRender'] 获取接口中的类型

export const MonthCalendar: FC<IMonthCalendarProps> = (props) => {
  const localeContext = useContext(LocaleContext);

  const { value, curMonth, dateRender, dateInnerContent, selectHandler } = props;

  const CalendarLocale = allLocales[localeContext.locale];

  const allDays = getAllDays(curMonth);

  function renderDays(days: DateCellList) {
    const rows: ReactNode[][] = [];
    for (let i = 0; i < ROW_COUNT; i++) {
      const row = [];
      for (let j = 0; j < COL_COUNT; j++) {
        const cell = days[i * 7 + j];
        row[j] = (
          <div
            className={classNames('month-calendar-body-cell', { 'month-calendar-body-cell-current': cell.currentMonth })}
            onClick={() => selectHandler?.(cell.date)}
          >
            {dateRender ? (
              dateRender(cell.date)
            ) : (
              <div className="month-calendar-body-cell-date">
                <div
                  className={classNames('month-calendar-body-cell-date-value', {
                    'month-calendar-body-cell-date-selected': value.isSame(cell.date, 'date'),
                    'month-calendar-body-cell-date-today': dayjs().isSame(cell.date, 'date'),
                  })}
                >
                  {cell.date.date()}
                </div>
                <div>{dateInnerContent && dateInnerContent(cell.date)}</div>
              </div>
            )}
          </div>
        );
      }
      rows[i] = row;
    }
    return rows.map((row, index) => (
      <div key={index} className="month-calendar-body-row">
        {row}
      </div>
    ));
  }

  return (
    <div className="month-calendar">
      <div className="month-calendar-week-list">
        {weekList.map((week) => {
          return (
            <div key={week} className="month-calendar-week-list-item">
              {CalendarLocale.week[week]}
            </div>
          );
        })}
      </div>

      <div className="month-calendar-body">{renderDays(allDays)}</div>
    </div>
  );
};

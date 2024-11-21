import { CSSProperties, FC, ReactNode, useState } from 'react';
import { MonthCalendar } from './MonthCalendar.tsx';
import dayjs, { Dayjs } from 'dayjs';
import './index.less';
import Header from './Header.tsx';
import classNames from 'classnames';
import LocaleContext from './localeContext.tsx';

// 使用 classnames 库，方便我们动态拼接 className，如 classnames('foo', 'bar') // => 'foo bar' classnames('foo', ['bar', {'zoo': true, 'bin': false}]) // => 'foo bar zoo'

export interface ICalendarProps {
  value?: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  dateRender?: (date: Dayjs) => ReactNode; // 替换掉单元格中的内容
  dateInnerContent?: (date: Dayjs) => ReactNode; // 展示到单元格的日期下方
  locale?: string;
  onChange?: (date: Dayjs) => void;
}

const Calendar: FC<ICalendarProps> = (props) => {
  const { style, className, locale, onChange } = props;

  const classString = classNames('calendar', className);

  const [curDate, setCurDate] = useState<Dayjs>(props.value || dayjs());

  const [curMonth, setCurMonth] = useState<Dayjs>(props.value || dayjs());

  const changeDate = (date: Dayjs) => {
    setCurDate(date);
    setCurMonth(date);
    onChange?.(date);
  };

  const changeCurDate = (date: Dayjs) => {
    changeDate(date);
  };

  const prevMonthHandler = () => {
    setCurMonth(curMonth.subtract(1, 'month'));
  };

  const nextMonthHandler = () => {
    setCurMonth(curMonth.add(1, 'month'));
  };

  const todayHandler = () => {
    const now = dayjs();
    changeDate(now);
  };

  // 如果没有提供 locale 属性，我们就使用浏览器的默认语言，其值就是 'en-US' 或 'zh-CN' 这种。

  return (
    <LocaleContext.Provider value={{ locale: locale || navigator.language }}>
      <div className={classString} style={style}>
        <Header curMonth={curMonth} prevMonthHandler={prevMonthHandler} nextMonthHandler={nextMonthHandler} todayHandler={todayHandler} />
        <MonthCalendar {...props} value={curDate} curMonth={curMonth} selectHandler={changeCurDate} />
      </div>
    </LocaleContext.Provider>
  );
};

export default Calendar;

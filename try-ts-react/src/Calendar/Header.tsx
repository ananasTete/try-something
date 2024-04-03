import {FC, useContext} from "react";
import {Dayjs} from "dayjs";
import LocaleContext from "./localeContext.tsx";
import allLocales from "./locale";

interface IHeader {
    curMonth: Dayjs;
    prevMonthHandler: () => void;
    nextMonthHandler: () => void;
    todayHandler: () => void
}

const Header: FC<IHeader> = (props) => {
    const localeContext = useContext(LocaleContext);

    const {today, formatMonth} = allLocales[localeContext.locale];

    const {curMonth, prevMonthHandler, nextMonthHandler, todayHandler} = props;

    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
            <div className="calendar-header-value">{curMonth.format(formatMonth)}</div>
            <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
            <button className="calendar-header-btn" onClick={todayHandler}>{today}</button>
        </div>
    </div>
}

export default Header;
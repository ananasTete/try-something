import "./App.css";
import {FC, useState} from "react";

// 技巧1：new Date 时，如果 date 传入 0, 会自动变成上个月的最后一天。然后使用 getDate() 可以得到上个月的最后一天是几号，同时也就得到了上个月有几天。同理，传入-1就可以拿到上个月的倒数第2天。

// 技巧2: 如果在 month 位置，传入 -1, 会自动变成上一年的 12 月;如果传入13, 会自动变成下一年的 1 月。

interface ICalendarProps {
    value?: Date;
    onChange?: (date: Date) => void;
}

const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
]


const getDayofMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

const getDaysCountOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
}

const renderDays = (date: Date) => {
    const days = [];
    const firstDay = getDayofMonth(date);
    const daysCount = getDaysCountOfMonth(date.getFullYear(), date.getMonth());
    const dayOfLastDate = new Date(date.getFullYear(), date.getMonth(), daysCount).getDay();
    const daysOfPrevMonth = getDaysCountOfMonth(date.getFullYear(), date.getMonth() - 1);

    for (let i = daysOfPrevMonth - firstDay + 1; i <= daysOfPrevMonth; i++) {
        days.push(<div id={`prev_${i}`} className="empty" key={`prev_${i}`}>{i}</div>);
    }

    for (let i = 1; i <= daysCount; i++) {
        if (i === date.getDate()) {
            days.push(<div id={`day_${i}`} className="day active" key={`day_${i}`}>{i}</div>);
            continue;
        }
        days.push(<div id={`day_${i}`} className="day" key={`day_${i}`}>{i}</div>);
    }

    if (dayOfLastDate !== 6) {
        for (let i = 1; i < 7 - dayOfLastDate; i++) {
            days.push(<div id={`next_${i}`} className="empty" key={`next_${i}`}>{i}</div>);
        }
    }


    return days;

}


const Home: FC<ICalendarProps> = (props) => {

    const {value} = props;

    const [date, setDate] = useState(value || new Date());

    const handlePrevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    }

    const handleNextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    }

    const handleClick = (e: any) => {
        while (!e.target.id && e.target.parentNode && e.target.parentNode.className !== 'days') {
            e.target = e.target.parentNode;
        }

        if (!e.target.id) return;

        const key = e.target.id;

        const clickDate = parseInt(key.split('_')[1]);

        let newDate = date;

        if (key.includes('prev')) {
            newDate = new Date(date.getFullYear(), date.getMonth() - 1, clickDate);
        } else if (key.includes('next')) {
            newDate = new Date(date.getFullYear(), date.getMonth() + 1, clickDate);
        } else {
            newDate = new Date(date.getFullYear(), date.getMonth(), clickDate);
        }

        Array.from(e.currentTarget.parentNode.children).forEach((child: any) => {
            child.classList.remove('active');
        });

        setDate(newDate);
    }


    return <div className='calendar'>
        <div className='header'>
            <div onClick={handlePrevMonth}>&lt;</div>
            <div>{date.getFullYear()} 年 {monthNames[date.getMonth()]}</div>
            <div onClick={handleNextMonth}>&gt;</div>
        </div>
        <div className='days' onClick={handleClick}>
            <div className="day">日</div>
            <div className="day">一</div>
            <div className="day">二</div>
            <div className="day">三</div>
            <div className="day">四</div>
            <div className="day">五</div>
            <div className="day">六</div>
            {renderDays(date)}
        </div>
    </div>
};

export default Home;
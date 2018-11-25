function Calendar(id) {
    const baseDate = 24 * 60 * 60 * 1000;
    let targetId = id;
    let today = new Date();
    let targetDate = today;
    let dateDisp;
    let container;
    let body;

    let clickEvent;
    let changeMonthEvent;

    let calenObj = {
        create: function() {
            let targetElement = document.getElementById(targetId);

            let calen = document.createElement('div');
            calen.setAttribute('class', 'calendar');
            let navbar = createCurrentDate(targetDate);
            calen.appendChild(navbar);

            container = document.createElement('div');
            container.setAttribute('class', 'calendar-container');

            let header = createHeader();
            container.appendChild(header);

            body = createBody(targetDate);
            container.appendChild(body);

            calen.appendChild(container);
            targetElement.appendChild(calen);

            dateDisp.innerHTML = formatDate(targetDate);
        },
        getTargetDate: function() {
            return targetDate;
        },
        setClickEvent: function(eventHandler) {
            if (!eventHandler) {
                return;
            }

            clickEvent = eventHandler;
        },
        setChangeMonthEvent: function(eventHandler) {
            if (!eventHandler) {
                return;
            }

            changeMonthEvent = eventHandler;
        },
        setOccurrenceDateList(dateList) {
            if (!Array.isArray(dateList)) {
                console.log('配列を指定してください。');
                return;
            }

            body.childNodes.forEach(element => {
                Array.prototype.forEach.call(element.getElementsByClassName('date-item'), dateItem => {
                    let itemDate = formatDate(new Date(dateItem.dataset.date));
                    if (dateList.some(dateStr => {
                        return dateStr === itemDate;
                    })) {
                        dateItem.classList.add('badge');
                    }
                });
            });
        }
    };

    return calenObj;

    /**
     *
     * @returns {HTMLElement}
     */
    function createCurrentDate() {
        let navbar = document.createElement('div');
        navbar.setAttribute('class', 'calendar-nav navbar');

        let leftBtn = document.createElement('button');
        leftBtn.setAttribute('class', 'btn btn-action btn-link btn-lg');
        leftBtn.addEventListener('click', () => {
            targetDate = addMonths(targetDate, -1);
            dateDisp.innerHTML = formatDate(targetDate);

            container.removeChild(body);
            body = createBody(targetDate);
            container.appendChild(body);

            changeMonthEvent(calenObj);
        });

        let leftIcon = document.createElement('span');
        leftIcon.setAttribute('class', 'icon icon-arrow-left');
        leftBtn.appendChild(leftIcon);
        navbar.appendChild(leftBtn);

        dateDisp = document.createElement('div');
        dateDisp.setAttribute('class', 'navbar-primary');
        dateDisp.innerHTML = formatDate(targetDate);
        navbar.append(dateDisp);

        let rightBtn = document.createElement('button');
        rightBtn.setAttribute('class', 'btn btn-action btn-link btn-lg');
        rightBtn.addEventListener('click', () => {
            targetDate = addMonths(targetDate, 1);
            dateDisp.innerHTML = formatDate(targetDate);

            container.removeChild(body);
            body = createBody(targetDate);
            container.appendChild(body);

            changeMonthEvent(calenObj);
        });

        let rightIcon = document.createElement('span');
        rightIcon.setAttribute('class', 'icon icon-arrow-right');
        rightBtn.appendChild(rightIcon);
        navbar.appendChild(rightBtn);

        return navbar;
    }

    /**
     * カレンダーのヘッダ部分を作成する
     * @returns {HTMLElement} 作成したカレンダーのヘッダ部分
     */
    function createHeader() {
        let header = document.createElement('div');
        header.className = 'calendar-header';

        let dayOfWeekStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let key in dayOfWeekStr) {
            let week = document.createElement('div');
            week.setAttribute('class', 'calendar-date');
            week.innerHTML = dayOfWeekStr[key];

            header.appendChild(week);
        }

        return header;
    }

    /**
     * カレンダーのボディ部分を作成する
     * @return {HTMLElement} 指定した月のカレンダーボディー
     */
    function createBody() {
        let currentMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

        let body = document.createElement('div');
        body.setAttribute('class', 'calendar-body');

        // prev month
        let prevDays = currentMonth.getDay() * -1;
        for (let i = prevDays; i < 0; i++) {
            let prevDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, i);
            createCalendarPanel(body, prevDay, 'prev-month');
        }

        // current month
        let today = new Date();
        let daysOfMonth = getMonthDays(targetDate.getFullYear(), targetDate.getMonth() + 1);
        let currentDay = {};
        for (let i = 1; i <= daysOfMonth; i++) {
            currentDay = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), i));
            if (Math.floor(currentDay.getTime() / baseDate) != Math.floor(today.getTime() / baseDate)) {
                createCalendarPanel(body, currentDay);
            } else {
                createCalendarPanel(body, currentDay, '', 'date-today');
            }

        }

        let afterDays = 6 - currentDay.getDay();
        for (let i = 1; i <= afterDays; i++) {
            let afterDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
            createCalendarPanel(body, afterDay, 'next-month');
        }

        return body;
    }

    function getMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * カレンダーのパネルを作成する
     * @param {Element} body パネルの追加先div要素
     * @param {Date} date 作成する日付
     * @param {String} className 追加するクラス名
     * @param panelClassName {String}
     * @param buttonClassName {String}
     */
    function createCalendarPanel(body, date, panelClassName, buttonClassName) {
        panelClassName = panelClassName || '';
        buttonClassName = buttonClassName || '';

        let panel = document.createElement('div');
        panel.setAttribute('class', 'calendar-date ' + panelClassName);

        let button = document.createElement('button');
        button.setAttribute('class', 'date-item ' + buttonClassName);
        button.innerHTML = String(date.getDate());
        button.dataset.date = String(date);
        button.addEventListener('click', (event) => {
            let date = new Date(event.target.dataset.date);
            targetDate = date;
            let dateStr = formatDate(date);
            dateDisp.innerHTML = dateStr;

            console.log("Date: " + dateStr);
            clickEvent(calenObj);
        });

        panel.appendChild(button);
        body.appendChild(panel);
    }

    function addMonths(date, count) {
        if (!date || !count) {
            return new Date();
        }

        let m, d = (date = new Date(+date)).getDate();
        date.setMonth(date.getMonth() + count, 1);
        m = date.getMonth();
        date.setDate(d);
        if (date.getMonth() !== m) {
            date.setDate(0);
        }

        return date;
    }
}

/**
 * 日付型をフォーマットする
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
    if (!date || !(date instanceof Date)) {
        return '';
    }

    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

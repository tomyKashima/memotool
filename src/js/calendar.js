function Calendar(targetId) {
    this.targetId = targetId;
    this.today = new Date();
    this.targetDate =  this.today;
    const baseDate = 24 * 60 * 60 * 1000;

    createCalender(this.targetDate, this.targetId);

    function createCalender(targetDate, targetId) {
        let targetElement = document.getElementById(targetId);

        let calen = document.createElement('div');
        calen.setAttribute('class', 'calendar');
        let navbar = createCurrentDate(targetDate);
        calen.appendChild(navbar);

        this.container = document.createElement('div');
        this.container.setAttribute('class', 'calendar-container');

        let header = createHeader();
        this.container.appendChild(header);

        this.body = createBody(targetDate);
        this.container.appendChild(this.body);

        calen.appendChild(this.container);
        targetElement.appendChild(calen);
    }

    /**
     *
     * @param targetDate
     * @returns {HTMLElement}
     */
    function createCurrentDate(targetDate) {
        let navbar = document.createElement('div');
        navbar.setAttribute('class', 'calendar-nav navbar');

        let leftBtn = document.createElement('button');
        leftBtn.setAttribute('class', 'btn btn-action btn-link btn-lg');
        leftBtn.addEventListener('click', () => {
            this.targetDate = addMonths(this.targetDate, -1);
            this.dateDisp.innerHTML = formatDate(this.targetDate);

            this.container.removeChild(this.body);
            this.body = createBody(this.targetDate);
            this.container.appendChild(this.body);
        });

        let leftIcon = document.createElement('span');
        leftIcon.setAttribute('class', 'icon icon-arrow-left');
        leftBtn.appendChild(leftIcon);
        navbar.appendChild(leftBtn);

        this.dateDisp = document.createElement('div');
        this.dateDisp.setAttribute('class', 'navbar-primary');
        this.dateDisp.innerHTML = formatDate(this.targetDate);
        navbar.append(this.dateDisp);

        let rightBtn = document.createElement('button');
        rightBtn.setAttribute('class', 'btn btn-action btn-link btn-lg');
        rightBtn.addEventListener('click', () => {
            this.targetDate = addMonths(this.targetDate, 1);
            this.dateDisp.innerHTML = formatDate(this.targetDate);

            this.container.removeChild(this.body);
            this.body = createBody(this.targetDate);
            this.container.appendChild(this.body);
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
     * @param {Date} targetDate カレンダーボディーを作成する月の情報
     * @return {HTMLElement} 指定した月のカレンダーボディー
     */
    function createBody(targetDate) {
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
     */
    function createCalendarPanel(body, date, panelClassName, buttonClassName) {
        panelClassName = panelClassName || '';
        buttonClassName = buttonClassName || '';

        let panel = document.createElement('div');
        panel.setAttribute('class', 'calendar-date ' + panelClassName);

        let button = document.createElement('button');
        button.setAttribute('class', 'date-item ' + buttonClassName);
        button.innerHTML = String(date.getDate());

        panel.appendChild(button);
        body.appendChild(panel);
    }

    function addMonths(date, count) {
        if (!date || !count) {
            return new Date();
        }

        var m, d = (date = new Date(+date)).getDate();
        date.setMonth(date.getMonth() + count, 1);
        m = date.getMonth();
        date.setDate(d);
        if (date.getMonth() !== m) {
            date.setDate(0);
        }

        return date;
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
}

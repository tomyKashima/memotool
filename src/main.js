
const { app, ipcMain, BrowserWindow, protocol } = require('electron');
const NeDB = require('nedb');
const path = require('path');
const url = require('url');

let win = null;
const db = {};

app.on('ready', () => {
    protocol.interceptFileProtocol('file', (req, callback) => {
        const requestedUrl = req.url.substr(7);

        if (path.isAbsolute(requestedUrl)) {
            callback(path.normalize(path.join(__dirname, requestedUrl)));
        } else {
            callback(requestedUrl);
        }
    });
});

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 750
    });
    win.loadURL(url.format({
        pathname: '/index.html',
        protocol: 'file:',
        slashes: true
    }));
    win.webContents.openDevTools();

    db.memo = new NeDB({ filename: 'data/memo.db'});
    db.memo.loadDatabase();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

// 新しいメモを保存する
// arg['Date'] 日付
// arg['Title'] メモのタイトル
// arg['Memo'] メモの本文
ipcMain.on('save-memo', (event, arg) => {
    console.log(arg);

    if (!arg['Date'] || !arg['Title'] || !arg['Memo']) {
        event.sender.send('error-message-replay', '日付とタイトルとメモを入力してください。');
        return;
    }

    let date = new Date(arg['Date']);
    console.log("arg.date: " + date);
    let doc = {
        'OccurrenceDateTime': new Date(),
        'Date': formatDate(date),
        'OccurrenceMonth': getMonth(date),
        'Title': arg['Title'],
        'Memo': arg['Memo']
    };

    db.memo.insert(doc, (err, newDoc) => {
        event.sender.send('asynchronous-memo-replay', newDoc);
    });
});

ipcMain.on('get-memos-in-month', (event, arg) =>{
   console.log('get-memos-in-moneth arg: ' + arg['Date']);
   let month = getMonth(new Date(arg['Date']));
   db.memo.find({ OccurrenceMonth: month }).sort({ Date: 1 }).exec((err, docs) => {
      let dateList = docs.filter((element, index, dateArray) => {
          return dateArray.map((e) => {return e['Date'];}).indexOf(element['Date']) === index;
      }).map(element => { return element['Date']; });

      event.sender.send('occurrense-date-list', dateList);
   });
});

// 指定日のメモを全て取得する
// arg['Date'] メモの取得対象日付
ipcMain.on('load-memo', (event, arg) => {
    console.log('load-memo arg: ' + arg['Date']);
    let date = formatDate(new Date(arg['Date']));
    console.log('load-memo date: ' + date);

    db.memo.find({ Date: date }, (err, docs) => {
        event.sender.send('asynchronous-memo-replay', docs);
    });
});

// 特定のメモを取得する
// arg['_id'] 対象メモのid
ipcMain.on('get-memo', (event, arg) => {
    console.log(arg);

    db.memo.find({ _id: arg['_id'] }, (err, docs) => {
        event.sender.send('memo-detail', docs[0]);
    });
});

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

/**
 * 日付型から月の情報を取得する
 * @param {Date} date
 */
function getMonth(date) {
    if (!date || !(date instanceof Date)) {
        return '';
    }

    return date.getFullYear() + '/' + (date.getMonth() + 1);
}
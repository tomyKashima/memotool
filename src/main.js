
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
        width: 800,
        height: 600
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

    db.memo.insert(arg, (err, newDoc) => {
        event.sender.send('asynchronous-memo-replay', newDoc);
    });
});

// 指定日のメモを全て取得する
// arg['Date'] メモの取得対象日付
ipcMain.on('load-memo', (event, arg) => {
    console.log(arg);

    db.memo.find({ Date: arg['Date'] }, (err, docs) => {
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
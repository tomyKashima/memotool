
/**
 * 日付をフォーマットする
 * @param {Date} date 日付
 * @param {String} format フォーマット文字列
 * @return {String} フォーマット済み日付
 */
function formatDate(date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        let milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        let length = format.match(/S/g).length;
        for (let i = 0; i < length; i++) {
            format = format.replace(/S/, milliSeconds.substr(i, i + 1));
        }
    }

    return format;
}
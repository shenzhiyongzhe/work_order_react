export function toChinaTime(isoString, withSeconds = true)
{
    const date = new Date(isoString);

    // 转为 UTC+8 时间
    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        ...(withSeconds && { second: '2-digit' }),
        hour12: false,
    };

    return new Intl.DateTimeFormat('zh-CN', options).format(date).replace(/\//g, '-');
}
export function getDateTime() 
{
    const date = new Date()
    const year = date.getFullYear(); // 年份，例如 2023
    const month = (date.getMonth() + 1).toString().padStart(2, 0); // 月份，0-11，0 表示一月，11 表示十二月
    const day = date.getDate().toString().padStart(2, 0); // 日期，1-31
    const hour = date.getHours().toString().padStart(2, 0);
    const minute = date.getMinutes().toString().padStart(2, 0);
    const second = date.getSeconds().toString().padStart(2, 0)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
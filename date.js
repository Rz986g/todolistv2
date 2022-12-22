exports.date = ()=>{
const today = new Date;
const option = {
    year: "numeric",
    month:"short",
    day:"numeric",
    weekday:"short",
    timeZone: "Asia/Hong_Kong",
}
return today.toLocaleDateString("en-UK",option)}

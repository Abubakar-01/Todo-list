
module.exports.getDate=getDate;

function  getDate(){
let today=new Date();
    let currentDay=today.getDay()
    let options={
        weekday: "long",
        day:"numeric",
        month:"long"
    }
    let day= today.toLocaleDateString("en-US",options); 
    return day;
}

module.exports.getDay=getDay;
function  getDay(){
    let today=new Date();
        let currentDay=today.getDay()
        let options={
            weekday: "long"}
        let day= today.toLocaleDateString("en-US",options); 
        return day;
    }
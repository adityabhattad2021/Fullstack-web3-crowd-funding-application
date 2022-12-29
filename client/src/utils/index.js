export function daysLeft(deadline){
    const difference=new Date(deadline).getTime()-Date.now()
    const remainingDays=difference/(1000*3600*24);
    return remainingDays.toFixed(0);
};


export function calculateBarPercentage(goal,raisedAmount){
    const percentage=Math.round((raisedAmount*100)/goal);
    return percentage;
}


export function checkIfImage(url,callBack){
    const image=new Image();
    image.src=url;

    if(image.complete){
        callBack(true);
    }

    image.onload=()=>callBack(true);
    image.onerror=()=>callBack(false);
}
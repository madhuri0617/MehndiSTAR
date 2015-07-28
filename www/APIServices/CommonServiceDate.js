
angular.module('Services',[])
.service('CommonServiceDate', function ($log) {
    this.getPostDate = function (date){
        var d = new Date();
        
        var abc = d.getTime() - date.getTime();
        
        var month = date.getMonth()+1;
        var days =  Math.floor(abc / (1000 * 60 * 60 * 24));
//        $log.debug(days);
        switch (month) {
            case 1:
                mon = "Jan";
                break;
            case 2:
                mon = "Feb";
                break;
            case 3:
                mon = "Mar";
                break;
            case 4:
                mon = "Apr";
                break;
            case 5:
                mon = "May";
                break;
            case 6:
                mon = "Jun";
                break;
            case 7:
                mon = "Jul";
                break;
            case 8:
                mon = "Aug";
                break;
            case 9:
                mon = "Sept";
                break;
            case 10:
                mon = "Oct";
                break;
            case 11:
                mon = "Nov";
                break;
            case 12:
                mon = "Dec";
                break;    
        } 
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        if(days<365)
        {
        var day = date.getDate();
//        $log.debug(day);    
        var strTime = " on " + mon + " " + day + " at " + hours + ':' + minutes + ' ' + ampm;
        return strTime;
        }
        else
        {   if(days >= 365 && days < 730)
            {
//            return strTime = "1 year ago" + " at " + hours + ':' + minutes + ' ' + ampm; 
              return strTime = "1 year ago";
            }
            else if(days>=730)
            {
                return strTime = "2 years ago";
            }
        }
    }; 
    });




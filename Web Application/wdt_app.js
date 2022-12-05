//Get staff users from api
$(document).ready(function() {
        $.ajax({
            url: 'https://randomuser.me/api/?results=5&inc=picture,name,email',
            dataType: 'json',
            success: function staffUserGet(data) {
                console.log(data)
                var userData = data.results
                    $("#user1").html(
                    "<td>"+"<img src='"+userData[0].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[0].name.first+"</td>"+
                    "<td>"+userData[0].name.last+"</td>"+
                    "<td>"+userData[0].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"
                    )
                    $("#user2").html(
                    "<td>"+"<img src='"+userData[1].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[1].name.first+"</td>"+
                    "<td>"+userData[1].name.last+"</td>"+
                    "<td>"+userData[1].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"
                    )
                    $("#user3").html(
                    "<td>"+"<img src='"+userData[2].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[2].name.first+"</td>"+
                    "<td>"+userData[2].name.last+"</td>"+
                    "<td>"+userData[2].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"
                    )
                    $("#user4").html(
                    "<td>"+"<img src='"+userData[3].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[3].name.first+"</td>"+
                    "<td>"+userData[3].name.last+"</td>"+
                    "<td>"+userData[3].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"
                    )
                    $("#user5").html(
                    "<td>"+"<img src='"+userData[4].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[4].name.first+"</td>"+
                    "<td>"+userData[4].name.last+"</td>"+
                    "<td>"+userData[4].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"
                    )
                
            }
        });

})



//Staff Table
$(document).ready(function() {


    //Table selected
    $('#staffTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $("tr.selected").removeClass('selected');
            $(this).addClass('selected');
        } 

        //Staff Out
        $("#outBtn").on("click", function staffOut(){
            
            //functions
            var userAnswer = parseFloat(prompt("Please provide the absence of the staff member in minutes:"))

            
            //Status Out
            $("tr.selected:contains('IN')").find("td").eq(4).html("OUT");

            
            //Out Time
            $("tr.selected").find("td").eq(5).html(function currentTime(){
                const d = new Date();
                var hour = d.getHours();
                var minutes = d.getMinutes();
                hour = checkTime(hour)
                minutes = checkTime(minutes)
                var currentTime = hour + ":" + minutes
                function checkTime(i){
                    if(i < 10){i = "0" + i}
                    return i; 
                }
                return currentTime
            });

            
            //Duration
            $("tr.selected").find("td").eq(6).html(function duration(){
                function timeConvert(num){ 
                    var hours = Math.floor(num / 60); 
                    var minutes = num % 60;
                    if(userAnswer < 60){
                        return minutes + "min"
                    } else{
                        return hours + "hr" + " " + minutes + "min";
                    }
                }
                while(true){
                    if(!isNaN(userAnswer)){
                        return timeConvert(userAnswer)
                    } else{
                        userAnswer = parseFloat(prompt("please provide the minutes in numbers"))
                    }   
                }
            })

            //Expected return Time
            $("tr.selected").find("td").eq(7).html(function expectedReturn(){
                function timeConvert(num){
                    const d = new Date();
                    var hour = d.getHours();
                    var minutes = d.getMinutes();
                    var cHours = hour + Math.floor(num / 60);
                    var cMinutes = (minutes + num) % 60;
                    console.log (minutes + num)
                    if((minutes + num) > 60 && hour == cHours){
                        cHours = cHours + Math.floor((minutes + num) / 60)
                    }
                    var expReturn = checkTime(cHours) + ":" + checkTime(cMinutes)
                    return expReturn;

                };
                function checkTime(i){
                    if(i < 10){i = "0" + i}
                    return i; 
                }
                return timeConvert(userAnswer)
            })

            //Toast if staff remeber is late
        })


        //Staff In
        $("#inBtn").on("click", function staffIn(){
            $("tr.selected:contains('OUT')").find("td").eq(4).html("IN")
            $("tr.selected").find("td").eq(5).html("")
            $("tr.selected").find("td").eq(6).html("")
            $("tr.selected").find("td").eq(7).html("")
        })
    });
})


//Schedule delivery
$(document).ready(function(){

    //Add button
    $("#addBtn").on("click", function addDelivery(){
        $("#tBodyBoard").html("<tr>" +
        "<td>" + $("#vehicle").val() + "</td>" +
        "<td>" + $("#inputFName").val() + "</td>" +
        "<td>" + $("#inputLName").val() + "</td>" +
        "<td>" + $("#phone").val() + "</td>" +
        "<td>" + $("#inputAdress").val() + "</td>" +
        "<td>" + $("#inputAdress") + "</td>" +
        "</tr>");
    }) 

    //Remove selected delivery with clear Button
    $('#tBodyBoard').on('click', 'tr', function removeDelivery() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $("tr.selected").removeClass('selected');
            $(this).addClass('selected');
        } 
        $("#clearBtn").on("click", function clearButton(){
            $("tr.selected").html("")
        })
    })
})























//Digital Clock Function
$(document).ready(function() {
    setInterval(function digitalClock() {
        const d = new Date();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var year = d.getFullYear();
        var hour = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        day = checkTime(day)
        month = checkTime(month)
        hour = checkTime(hour)
        minutes = checkTime(minutes)
        seconds = checkTime(seconds)
        var currentTime = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
        $("#dateTime").html(currentTime);
        
    }, 1000);
    function checkTime(i){
        if(i < 10){i = "0" + i}
        return i; 
    }
})
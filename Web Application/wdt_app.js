//Get staff users from api
$(document).ready(function() {
        $.ajax({
            url: 'https://randomuser.me/api/?results=5&inc=picture,name,email',
            dataType: 'json',
            success: function(data) {
                console.log(data)
                var userData = data.results
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData[0].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[0].name.first+"</td>"+
                    "<td>"+userData[0].name.last+"</td>"+
                    "<td>"+userData[0].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "</tr>"
                    )
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData[1].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[1].name.first+"</td>"+
                    "<td>"+userData[1].name.last+"</td>"+
                    "<td>"+userData[1].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "</tr>"
                    )
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData[2].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[2].name.first+"</td>"+
                    "<td>"+userData[2].name.last+"</td>"+
                    "<td>"+userData[2].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "</tr>"
                    )
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData[3].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[3].name.first+"</td>"+
                    "<td>"+userData[3].name.last+"</td>"+
                    "<td>"+userData[3].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "</tr>"
                    )
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData[4].picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData[4].name.first+"</td>"+
                    "<td>"+userData[4].name.last+"</td>"+
                    "<td>"+userData[4].email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "<td>"+""+"</td>"+
                    "</tr>"
                    )
                
            }
        });

})

//Button in function

//Button out function
$(document).ready(function() {
    $("#staffTable tbody tr").click(function(){
        $(this).addClass("selected").siblings().removeClass("selected"); 
        var value = $(this).find('td:first').html()
        console.log(value)
        });
    
    $("#negativeButton").on("click", function(e){
            $("input[name*='IN']").val("OUT");
    });
});

// Current date and time
$(document).ready(function() {
    setInterval(function() {
        const d = new Date();
        var day = d.getDate();
        day = day.toString().padStart(2, '0');
        var month = d.getMonth()+1;
        month = month.toString().padStart(2, '0');
        var year = d.getFullYear();
        var hour = d.getHours();
        hour = hour.toString().padStart(2, '0');
        var minutes = d.getMinutes();
        minutes = minutes.toString().padStart(2, '0');
        var seconds = d.getSeconds();
        seconds = seconds.toString().padStart(2, '0');
        var currentTime = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
        $("#dateTime").html(currentTime);
        
    }, 1000);
})
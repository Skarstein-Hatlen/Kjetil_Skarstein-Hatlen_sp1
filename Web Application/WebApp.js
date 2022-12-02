//Retrieving persons with API
$(document).ready(function() {
    //Click button calls api
    $("#positiveButton").click(function() {
        $.ajax({
            url: 'https://randomuser.me/api/?inc=picture,name,email',
            dataType: 'json',
            success: function(data) {
                console.log(data)
                var userData = data.results[0]
                    $("#tdata").append("<tr>"+
                    "<td>"+"<img src='"+userData.picture.thumbnail+"'>"+"</img>"+"</td>"+
                    "<td>"+userData.name.first+"</td>"+
                    "<td>"+userData.name.last+"</td>"+
                    "<td>"+userData.email+"</td>"+
                    "<td>"+"IN"+"</td>"+
                    "</tr>"
                    )
            }
        });
        
    })
})


let staffMembers = [];

$(document).ready(function() {
    // Get staff members
    staffUserGet().then(staff => staffMembers = staff);

    //Table selected
    $("#staffTable tbody").on("click", "tr", selectStaff);

    //Staff Out
    $("#outBtn").on("click", staffOut);

    // Staff in
    $("#inBtn").on("click", staffIn);
});

function selectStaff() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $("tr.selected").removeClass("selected");
        $(this).addClass("selected");
    }
}

function staffOut(){
    let selected = $("tr.selected");
    let userId = parseFloat(selected[0].id.substring(4));

    //functions
    let userAnswer = parseFloat(prompt("Please provide the absence of the staff member in minutes:"));
    let staffMember = staffMembers.find(c => c.id === userId);

    //Expected return Time
    let expectedBack = expectedReturn(userAnswer);
    staffMember.out(expectedBack);
    selected.find("td").eq(7).html(expectedBack)

    //Status Out
    $("tr.selected:contains('IN')").find("td").eq(4).html("OUT");

    //Out Time
    selected.find("td").eq(5).html(currentTime());

    //Duration
    selected.find("td").eq(6).html(function duration(){
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
                userAnswer = prompt("Please provide the minutes in numbers");
            }
        }
    })

    setTimeout(() => {
        let staff = staffMembers.find(c => c.id === userId);

        console.log(`Staff ${staff.id} has returned: ${!staff.isOut}`);
        if(staff.isOut) {
            staffMemberIsLate(staff, userAnswer);
        }
    }, userAnswer * 60 * 1000); // popup
}

function staffIn(){
    let selected = $("tr.selected");
    let userId = parseFloat(selected[0].id.substring(4));
    let staffMember = staffMembers.find(c => c.id === userId);
    staffMember.in();

    $("tr.selected:contains('OUT')").find("td").eq(4).html("IN")
    selected.find("td").eq(5).html("")
    selected.find("td").eq(6).html("")
    selected.find("td").eq(7).html("")
}

//Toast if staff remeber is late
function staffMemberIsLate(staffMember){
    $("#toastImg").attr("src", staffMember.avatar);
    $("#toastSmall").html(overdueMin + "min overdue");
    $("#toastName").html(staffMember.name.first + " " +staffMember.name.last);
    $("#toastMessage").html(`${staffMember.displayName} is late, we expected ${staffMember.name.last} back ${staffMember.expectedReturn}`);
    $("#liveToast").removeClass("hide").addClass("show");
    $("#closeBtn").on("click", function closeToast(){
        $("#liveToast").removeClass("show").addClass("hide")
    });
};

let overdueMin = 0;
function overdue() {
    if ($("#liveToast").hasClass("show")) {
    overdueMin += 1;
    }
} 
setInterval(overdue, 1000);
console.log(overdueMin)

//Schedule delivery and add to delivery board
$(document).ready(function(){

    //Add button for adding delivery to board
    $("#addBtn").on("click", function addDelivery(){
        let deliveryInfo = "<tr>" +
        "<td>" + $("#vehicle").val() + "</td>" +
        "<td>" + $("#inputFName").val() + "</td>" +
        "<td>" + $("#inputLName").val() + "</td>" +
        "<td>" + $("#phone").val() + "</td>" +
        "<td>" + $("#inputAdress").val() + "</td>" +
        "<td>" + $("#returnTime").val() + "</td>" +
        "</tr>";
        $("#tBodyBoard").append(deliveryInfo);
    });

    //Remove selected delivery with clear Button
    $("#tBodyBoard").on("click", "tr", function removeDelivery() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        } else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
        }
        $("#clearBtn").on("click", function clearButton(){
            $("tr.selected").html("")
        })
    })

    //Validate Delivery function

    //Vehicle
    $("#vehicle").on("change", function(){
        let value = $(this).eq(0).val().toLowerCase();
        if(value !== "car") {
            $(this).val("");
            alert("Please try again and enter the either a car or a motorcycle");
        } else {
            return $(this).eq(0).val()
        }        
    })

    //First name
    $("#inputFName").on("change", function(){
        let regexLetters = /^[a-zA-Z]+$/;
        if(!regexLetters.test($(this).val())) {
            $(this).val("");
            alert("Please try again and enter a first name with letters only");
        } else {
            return $(this).eq(0).val()
        }        
    })

    //Last Name
    $("#inputLName").on("change", function(){
        let regexLetters = /^[a-zA-Z]+$/;
        if(!regexLetters.test($(this).val())) {
            $(this).val("");
            alert("Please try again and enter a last name with letters only");
        } else {
            return $(this).eq(0).val()
        }        
    })

    //Phone number
    $("#phone").on("change", function(){
        let regexPhone = /^\+?[0-9]{7,}([0-9-]*[0-9])?$/;
        if(!regexPhone.test($(this).val())) {
            $(this).val("");
            alert("Please provide a valid phone number of at least 7 numbers");
        } else {
            return $(this).eq(0).val()
        }        
    })

    //Adress
    $("#inputAdress").on("change", function(){
        let regexAdress = /^(?=.*\d)(?=.*[a-zA-Z]).+$/;
        if(!regexAdress.test($(this).val())) {
            $(this).val("");
            alert("Please enter a valid adress with both street and number");
        } else {
            return $(this).eq(0).val()
        }        
    })

    //Return Time
    $("#returnTime").on("change", function(){
        const currentTime = new Date()
        let enteredTime = new Date();
        let regexReturn = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        enteredTime.setHours($(this).val().split(":")[0]);
        enteredTime.setMinutes($(this).val().split(":")[1]);
        if(!regexReturn.test($(this).val())) {
            $(this).val("");
            alert("Please enter a valid time format");
        } else if(enteredTime > currentTime) {
            $(this).val("");
            alert("Please enter a valid time in format the present")
        }
        else {
            return $(this).eq(0).val()
        }        
    })

    //Delivery Driver is late function
})


//--------------------------------------------------------------------//

/**
 * Staff section
 */
class StaffMember {
    constructor(user, id) {
        this.id = id;
        this.email = user.email;
        this.name = {...user.name}
        this.displayName = `${this.name.first} ${this.name.last}`
        this.avatar = user.picture.thumbnail;
        this.isOut = false;
        this.outTime = '';
        this.expectedReturn = '';
    }

    out(expectedReturn){
        this.isOut = true;
        this.outTime = currentTime();
        this.expectedReturn = expectedReturn;
    }

    in(){
        this.isOut = false;
        this.outTime = '';
    }
}

/**
 * retrieve users, map them to staff members and add them to the view.
 * @returns {Promise<StaffMember[]>}
 */
async function staffUserGet(){
    let staffMembers = await fetch('https://randomuser.me/api/?results=5&inc=picture,name,email')
        .then(result => result.json())
        .then(data => data.results.map((user, i) => new StaffMember(user, i+1)));

    for(const staffMember of staffMembers) {
        const targetEl = `#user${staffMember.id}`;

        $(targetEl).html(
            "<td>" + "<img alt='avatar' src='" + staffMember.avatar + "'/></td>" +
            "<td>" + staffMember.name.first + "</td>" +
            "<td>" + staffMember.name.last + "</td>" +
            "<td>" + staffMember.email + "</td>" +
            "<td>" + "IN" + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "" + "</td>"
        );
    }

    return staffMembers;
}

/**
 * returns the current time
 * @returns {string}
 */
function currentTime(){
    const d = new Date();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    hour = checkTime(hour);
    minutes = checkTime(minutes);
    return hour + ":" + minutes;
}

/**
 * adds leading zeros to the 24hr clock
 * @returns {string}
 */
function checkTime(i){
    if(i < 10){i = "0" + i}
    return i;
}

/**
 * returns expected return time of staff members
 * @returns {string}
 */
function expectedReturn(userAnswer){
    function timeConvert(num){
        const d = new Date();
        var hour = d.getHours();
        var minutes = d.getMinutes();
        var cHours = hour + Math.floor(num / 60);
        var cMinutes = (minutes + num) % 60;

        if((minutes + num) > 60 && hour == cHours){
            cHours = cHours + Math.floor((minutes + num) / 60)
        }
        return checkTime(cHours) + ":" + checkTime(cMinutes)
    }

    return timeConvert(userAnswer)
}

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
})

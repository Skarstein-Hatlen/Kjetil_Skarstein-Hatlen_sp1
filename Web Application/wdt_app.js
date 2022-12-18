let staffMembers = [];
let deliveryDrivers = [];


//Staff Table
$(document).ready(function() {
    //Get staff members
    staffUserGet().then(function(staff){
        staffMembers = staff
    });

    //Table selected
    $("#staffTable tbody").on("click", "tr", selectStaff);

    //Staff Out
    $("#outBtn").on("click", staffOut);

    // Staff in
    $("#inBtn").on("click", staffIn);
});

//Select from table
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
    let userAnswer = parseFloat(prompt("Please provide the absence of the staff member in minutes:"));
    console.log(userAnswer)
        if(userAnswer < 1 || userAnswer == "" || isNaN(userAnswer)){
            alert("Please provide a valid number greater than 1 in order to leave the office")
            return null;
        };
    let staffMember = staffMembers.find(c => c.id === userId);

    //Expected return Time
    let expectedBack = expectedReturn(userAnswer);
    staffMember.out(expectedBack);
    selected.find("td").eq(7).html(expectedBack);

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
        return timeConvert(userAnswer)
    })

    //Staff is Late
    setTimeout(() => {
        let staff = staffMembers.find(c => c.id === userId);

        console.log(`Staff ${staff.id} has returned: ${!staff.isOut}`);
        if(staff.isOut) {
            staff.staffMemberIsLate($);
        }
    }, userAnswer * 60 * 1000);
}

//Staff in, clear their Out Time, Duration, Expected Return and status
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




//----------------------------------------------------------------------------------//

//Schedule delivery and add to delivery board
$(document).ready(function(){
    $("#tBodyBoard").on("click", "tr", selectDriver);
    $("#clearBtn").on("click", removeDelivery)
    setInterval(deliveryDriverIsLate, 1000)
    
})

//Add delivery validates format and add information
function addDelivery(form) {
    let driver = validateDelivery(form);
    if(driver == null)
        return;
    deliveryDrivers.push(driver);
    driver.add($);
    console.log(deliveryDrivers)
}

function validateDelivery(form) {
    if(form.checkValidity() !== true)
        return null;

    let driver = new DeliveryDriver({
        vehicle: form.vehicle.value,
        name: form.name.value,
        surname: form.surname.value,
        telephone: form.telephone.value,
        deliveryAddress: form.deliveryAddress.value,
        returnTime: form.returnTime.value
    });
    return driver;
}

function selectDriver() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $("tr.selected").removeClass("selected");
        $(this).addClass("selected");
    }
}

function removeDelivery() {
    let selected = $("tr.selected");
    let index = selected.index();
    let text = "Are you sure you wish to clear the selected delivery?";
    if (selected.length === 0) {
    alert("No delivery was selected.");
        return;
    }
    if (!confirm(text)) {
        return;
    }
    deliveryDrivers.splice(index, 1);
    selected.remove();
    console.log(deliveryDrivers)
}



function deliveryDriverIsLate() {
    const now = currentTime();
    for (driver of deliveryDrivers.filter(driver => driver.returnTime == now)) {
        driver.notifyIsLate();
    }
}



//--------------------------------------------------------------------------------------------//


//retrieve users, map them to staff members and add them to the view.
async function staffUserGet(){
    let staffMembers = await fetch('https://randomuser.me/api/?results=5&inc=picture,name,email')
        .then(result => result.json())
        .then(data => data.results.map((user, i) => new StaffMember(user, i+1)));

    for(const staffMember of staffMembers) {
        const targetEl = `#user${staffMember.id}`;

        $(targetEl).html(
            "<td>" + "<img alt='avatar' src='" + staffMember.avatar + "'/></td>" +
            "<td>" + staffMember.name + "</td>" +
            "<td>" + staffMember.surname + "</td>" +
            "<td>" + staffMember.email + "</td>" +
            "<td>" + "IN" + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "" + "</td>"
        );
    }
    return staffMembers;
}


//returns the current time
function currentTime(){
    const d = new Date();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    hour = checkTime(hour);
    minutes = checkTime(minutes);
    return hour + ":" + minutes;
}


//Adds leading zeros to the 24hr clock
function checkTime(i){
    if(i < 10){i = "0" + i}
    return i;
}


//Expected return time of staff members
function expectedReturn(userAnswer){
        let d = new Date();
        d.setMinutes(d.getMinutes() + userAnswer);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        return hours + ":" + minutes;
}


//Digital Clock Function
$(document).ready(function() {
    setInterval(function digitalClock() {
        const d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        day = checkTime(day)
        month = checkTime(month)
        hour = checkTime(hour)
        minutes = checkTime(minutes)
        seconds = checkTime(seconds)
        var currentTime = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
        $("#dateTime").html(currentTime);
    }, 1000);
})


//Super
class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}


//Staff
class StaffMember extends Employee {
    constructor(user, id) {
        super(user.name.first, user.name.last)
        this.id = id;
        this.email = user.email;

        this.displayName = `${this.name} ${this.surname}`
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

    staffMemberIsLate($){
        let toast = $("#staffToast").clone();
        let overdueCounter = 0;
        function setOverdue() {
            toast.find("#toastSmall").html(overdueCounter + "min overdue")
            overdueCounter += 1;
        }
        setOverdue()
        let cancel = setInterval(setOverdue, 60000);
        
        toast.find("#toastImg").attr("src", this.avatar);
        toast.find("#toastName").html(this.displayName);
        toast.find("#toastMessage").html(`${this.displayName} is late, we expected ${this.name} back ${this.expectedReturn}`);
        toast.find("#liveToast").removeClass("hide").addClass("show");
        toast.find("#closeBtn").on("click", function() {
            clearInterval(cancel);
            $(toast).remove();
        })

        $("body").append(toast)
    }
}


//Delivery
class DeliveryDriver extends Employee {
    constructor({name, surname, vehicle, telephone, deliveryAddress, returnTime}) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliveryAddress = deliveryAddress;
        this.returnTime = returnTime;
        this.notified = false;
    }

    notifyIsLate(){
        if(this.notified)
            return
            let toast = $("#deliveryToast").clone();
            toast.find("#toastNameDelivery").html(this.name + " " + this.surname);
            toast.find("#toastMessageDelivery").html(`Telephone: ${this.telephone}<br> Adress: ${this.deliveryAddress}`);
            toast.find("#estimatedReturn").html("Expected return: " + this.returnTime)
            toast.find("#liveToast").removeClass("hide").addClass("show");
            toast.find("#closeBtn").on("click", function() {
                $(toast).remove();
            })
        
            $("body").append(toast)
            this.notified = true;
    }

    add($){
        if(this.returnTime > currentTime()){
            this.returnTime = this.returnTime
        } else {
            alert("Please provide the Return Time in a present time format")
            return;
        }
        if(this.vehicle.toLowerCase() == "car"){
            this.vehicle = "<i class='bi bi-car-front-fill'></i>"
        } else if(this.vehicle.toLowerCase() == "motorcycle"){
            this.vehicle = "<i class='fa-solid fa-motorcycle'></i>"
        }

        let deliveryInfo = "<tr>" +
            "<td>" + this.vehicle + "</td>" +
            "<td>" + this.name + "</td>" +
            "<td>" + this.surname + "</td>" +
            "<td>" + this.telephone + "</td>" +
            "<td>" + this.deliveryAddress + "</td>" +
            "<td>" + this.returnTime + "</td>" +
            "</tr>";
        $("#tBodyBoard").append(deliveryInfo);
    }
}

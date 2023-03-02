$(document).ready(function(){
    const firebaseConfig = {
        apiKey: "AIzaSyC-0htnksKwJ2nf4Y2HaFpNJZ2tcq0_xFk",
        authDomain: "iot-plant-174a3.firebaseapp.com",
        databaseURL: "https://iot-plant-174a3-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "iot-plant-174a3",
        storageBucket: "iot-plant-174a3.appspot.com",
        messagingSenderId: "585896862051",
        appId: "1:585896862051:web:f7d563bb01bd782d33f356",
        measurementId: "G-0B1F31X19V"
    };

    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    // Độ ẩm đất
    database.ref("/Do_am_dat").on("value", function(snapshot){
        var Soil_Moisture = snapshot.val();
        document.getElementById('Soil_Moisture').innerHTML = Soil_Moisture;
    });

    // Nhiệt độ
    database.ref("/Nhiet_do(do_C)").on("value", function(snapshot){
        var Temperature = snapshot.val();
        document.getElementById('Temperature').innerHTML = Temperature;
    });

    // Độ ẩm không khí
    database.ref("/Do_am_khong_khi").on("value", function(snapshot){
        var Air_Humidity = snapshot.val();
        document.getElementById('Air_Humidity').innerHTML = Air_Humidity;
    });

    // Trạng thái máy bơm
    database.ref("/Trang_thai_may_bom").on("value", function(snapshot){
        var Status = snapshot.val();
        document.getElementById('Status').innerHTML = Status;
    });

    // Cảnh báo
    database.ref("/Thong_bao").on("value", function(snapshot){
        var warning = snapshot.val();
        if(warning == ' ')
        {
            document.getElementById("displ").style.display = 'none';
        }
        if (warning == 'Độ ẩm đất thấp')
        {
            document.getElementById('warning').innerHTML = warning;
        }
    });
})
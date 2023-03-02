document.addEventListener("DOMContentLoaded", () => {
    new ApexCharts(document.querySelector("#reportsChart"), {
        series: [{
            name: 'Nhiệt độ',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Độ ẩm',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
            show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#4154f1', '#2eca6a', '#ff771d'],
        fill: {
            type: "gradient",
            gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.4,
            stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            type: 'datetime',
            categories: ["2022-10-19T00:00:00.000Z", "2022-06-19T01:30:00.000Z", "2022-02-19T02:30:00.000Z", "2021-10-19T03:30:00.000Z", "2021-6-19T04:30:00.000Z", "2021-02-19T05:30:00.000Z", "2020-10-19T06:30:00.000Z"]
        },
        tooltip: {
            x: {
            format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();
});


$(document).ready(function(){
    // Lấy dữ liệu thời tiết
    const getLink = "https://api.open-meteo.com/v1/forecast?latitude=21.59&longitude=105.85&hourly=temperature_2m,relativehumidity_2m,weathercode&current_weather=true&timezone=Asia%2FBangkok"
    function GetJSON(){
        URL_JSON = getLink;
        fetch(URL_JSON)
          .then(response => response.json())
          .then(Json =>{
            temperature = Json["current_weather"]["temperature"]; // Nhiệt độ
            winddirection = Json["current_weather"]["winddirection"]; // Độ ẩm
            weathercode = Json["current_weather"]["weathercode"]; // Mã thời tiết
            time = Json["current_weather"]["time"]; // Thời gian

            // var NhietDo = document.getElementById('NhietDo');
            document.getElementById('NhietDo').innerHTML = temperature;
            document.getElementById('DoAm').innerHTML = winddirection;

            if(weathercode == 0){
                StringWeather = "Trời quang đãng";
            }
            else if(weathercode == 1 || weathercode == 2 || weathercode == 3){
                StringWeather = "Có mây và u ám";
            }
            else if(weathercode == 45 || weathercode == 48){
                StringWeather = "Có sương mù lắng đọng";
            }
            else if(weathercode == 51 || weathercode == 53 || weathercode == 55){
                StringWeather = "Có mưa phùn";
            }
            else if(weathercode == 56 || weathercode == 57){
                StringWeather = "Có mưa phùn, đóng băng";
            }
            else if(weathercode == 61 || weathercode == 63 || weathercode == 65){
                StringWeather = "Có mưa nhẹ";
            }
            else if(weathercode == 66 || weathercode == 67){
                StringWeather = "Có mưa đóng băng";
            }
            else if(weathercode == 71 || weathercode == 73 || weathercode == 75){
                StringWeather = "Có tuyết rơi";
            }
            else if(weathercode == 80 || weathercode == 81 || weathercode == 82){
                StringWeather = "Mưa rào";
            }
            else if(weathercode == 85 || weathercode == 86){
                StringWeather = "Mưa tuyết nhẹ và nặng";
            }
            else if(weathercode == 95 || weathercode == 96 || weathercode == 99){
                StringWeather = "Giông bão";
            }
            else{
                StringWeather = "Lỗi gì đó";
            }
            document.getElementById('TrangThaiThoiTiet').innerHTML = StringWeather;
        })
    }
    setInterval(GetJSON, 300);
});
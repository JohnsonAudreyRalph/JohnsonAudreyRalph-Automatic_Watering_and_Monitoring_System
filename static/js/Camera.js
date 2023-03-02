// $(document).ready(function(){
//     // Phần dành cho Camera
//     var video = document.querySelector('video');
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     .then(function(stream) {
//         video.srcObject = stream;
//     })
//     .catch(function(error) {
//         console.error('Lỗi không mở được camera:', error);
//         alert('Lỗi không mở được camera:')
//     });
// });
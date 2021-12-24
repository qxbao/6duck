$(document).ready(()=>{
    socket.emit("update regcode");
    $("#regcodeForm").submit(()=>{
        $('#statusLabel').text("Trạng thái")
        $('#statusLabel').attr('class', "m-auto")
        $('#spinner').removeClass("d-none")
        $('.result').remove()
        $('#status-modal').modal("show")
        $('#status-content').attr("class","d-none text-center")
        let name = $("#fullname").val()
        let fb = $("#facebookusr").val()
        $.post('',{name:name,fb:fb},(data)=>{
            $('#spinner').addClass("d-none")
            $('#status-content').removeClass("d-none")
            switch(data.status){
                case "done":
                    $('#statusLabel').attr('class', "m-auto text-success");
                    $('#statusLabel').text("Thành công!");
                    $('#status-content h5').text("Đây là regcode của bạn:");
                    $('#status-content').append("<p class='badge bg-success result fs-5 fw-light'><b id='regcode'>"+data.code+"</b></p>");
                    $('#status-content').append("<p class='result'>Mã này có hiệu lực trong 24h tới. Hãy lưu trữ và sử dụng một cách có trách nhiệm. Mọi trường hợp thu hồi code hoặc đình chỉ tài khoản sẽ không cần báo lí do.</p>");
                    $('#status-content').append("<a class='result' href='/register?code="+data.code+"'>Đăng ký ngay tại đây</a>");
                    socket.emit("update regcode");
                    break;
                case "nomore":
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Thất bại!")
                    $('#status-content h5').text("Số lượng regcode hôm nay đã hết. Vui lòng trở lại sau")
                    break;
                case "fail":
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Thất bại!")
                    $('#status-content h5').text("Thông tin không hợp lệ hoặc đã tồn tại.")
                    break;
                default:
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Thất bại!")
                    $('#status-content h5').text("Thông tin không hợp lệ hoặc đã tồn tại.")
            }
            $('#close-reg').removeAttr('disabled')
        },'json')
        return false;
    })
    socket.on("regcode updating", (msg) => {
        $('#today').text(msg.limit - msg.remain)
    })
})

$(document).ready(()=>{
    $('#loginForm').submit(()=>{
        let pwd = $("#password").val()
        let usr = $("#username").val()
        $('#statusLabel').text("Trạng thái")
        $('#statusLabel').attr('class', "m-auto")
        $('#spinner').removeClass("d-none")
        $('.result').remove()
        $('#status-modal').modal("show")
        $('#status-content').attr("class","d-none text-center")
        $.post('/login/check',{username:usr, password:pwd},async(data)=>{
            $('#spinner').addClass("d-none")
            $('#status-content').removeClass("d-none")
            switch(data.status){
                case "success":
                    await $.post('',{username:usr, password:pwd})
                    $('#statusLabel').attr('class', "m-auto text-success");
                    $('#statusLabel').text("Đăng nhập thành công");
                    $('#status-content h5').text("Tự động điều hướng về trang chủ");
                    setTimeout(()=>{
                        window.location.href = '/'
                    },2000)
                    break;
                case "nomatch":
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Thất bại!")
                    $('#status-content h5').text("Mật khẩu không đúng, xin thử lại.")
                    break;
                case "notfound":
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Thất bại!")
                    $('#status-content h5').text("Tài khoản không tồn tại.")
                    break;
                default:
                    $('#statusLabel').attr('class', "m-auto text-danger")
                    $('#statusLabel').text("Lỗi!!!")
                    $('#status-content h5').text("Đã xảy ra lỗi không xác định")
                }
            $('#close-reg').removeAttr('disabled')
        },'json')
        return false;
    })
})

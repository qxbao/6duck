$(document).ready(() => {
    $("#registerForm").submit(() => {
        $('#statusLabel').text("Trạng thái")
        $('#statusLabel').attr('class', "m-auto")
        $('#spinner').removeClass("d-none")
        $('.result').remove()
        $('#close-reg').attr('disabled')
        $('#status-modal').modal("show")
        let pwd = $("#password").val()
        let repwd = $("#repassword").val()
        let regcode = $("#regcode").val()
        let username = $("#username").val()
        if (pwd == repwd && pwd.length > 8) {
            $.post('', {
                regcode: regcode,
                username: username,
                password: pwd
            }, (data) => {
                $('#spinner').addClass("d-none")
                $('#status-content').removeClass("d-none")
                switch (data.status) {
                    case "success":
                        $('#statusLabel').attr('class', "m-auto text-success")
                        $('#statusLabel').text("Thành công!")
                        $('#status-content h5').text("Xin chúc mừng")
                        $('#status-content').append("<p class='result mb-2'>Bạn đã tạo tài khoản thành công</p>")
                        $('#status-content').append("<p class='result'><i>Tự động chuyển tới trang đăng nhập</i></p>");
                        setTimeout(()=>{
                            window.location.href = '/login?username='+data.username;
                        },2000)
                        break;
                    case "notmatch":
                        $('#statusLabel').attr('class', "m-auto text-danger")
                        $('#statusLabel').text("Thất bại!")
                        $('#status-content h5').text("Tên tài khoản hoặc mật khẩu sai định dạng.")
                        break;
                    case "username":
                        $('#statusLabel').attr('class', "m-auto text-danger")
                        $('#statusLabel').text("Thất bại!")
                        $('#status-content h5').text("Tên người dùng đã được sử dụng.")
                        break;
                    case "regcode":
                        $('#statusLabel').attr('class', "m-auto text-danger")
                        $('#statusLabel').text("Thất bại!")
                        switch (data.des) {
                            case 'invalidformat':
                                $('#status-content h5').text("Regcode sai định dạng.");
                                break;
                            case 'notfound':
                                $('#status-content h5').text("Regcode không tồn tại.");
                                break;
                            case 'outdated':
                                $('#status-content h5').text("Regcode đã hết hạn sử dụng");
                                break;
                        }
                        break;
                    default:
                        $('#statusLabel').attr('class', "m-auto text-danger");
                        $('#statusLabel').text("Thất bại!");
                        $('#status-content h5').text("Lỗi không xác định");
                }
                $('#close-reg').removeAttr('disabled')
            }, 'json')
        } else {
            $('#spinner').addClass("d-none")
            $('#status-content').removeClass("d-none")
            $('#statusLabel').attr('class', "m-auto text-danger")
            $('#statusLabel').text("Thất bại!")
            if (pwd == "") {
                $('#status-content h5').text("Không được để trống mật khẩu")
                $('#close-reg').removeAttr('disabled')
            } else {
                $('#status-content h5').text("Mật khẩu nhập không khớp hoặc không đủ 8 ký tự")
                $('#close-reg').removeAttr('disabled')
            }
        }
        return false
    })
})

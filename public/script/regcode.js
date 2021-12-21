$(document).ready(()=>{
    $("#checkValid").click(()=>{
        $('#statusLabel').text("Trạng thái")
        $('#statusLabel').attr('class', "m-auto")
        $('#spinner').removeClass("d-none")
        $('.result').remove()
        $('#status-content').attr("class","d-none text-center")
        let name = $("#fullname").val()
        let fb = $("#facebookusr").val()
        $.post('',{name:name,fb:fb},(data)=>{
            if(data.status == "done"){
                $('#statusLabel').attr('class', "m-auto text-success")
                $('#statusLabel').text("Thành công!")
                $('#status-content').removeClass("d-none")
                $('#spinner').addClass("d-none")
                $('#status-content h5').text("Đây là regcode của bạn:")
                $('#status-content').append("<p class='badge bg-success result fs-5 fw-light'><b id='regcode'>"+data.code+"</b></p>")
                $('#status-content').append("<p class='result'>Mã này có hiệu lực trong 24h tới. Hãy lưu trữ và sử dụng một cách có trách nhiệm. Mọi trường hợp code bị thu hồi hoặc tài khoản bị đình chỉ sẽ không cần báo lí do.</p>")
                $('#close-reg').removeAttr('disabled')
            }else{
                $('#statusLabel').attr('class', "m-auto text-danger")
                $('#statusLabel').text("Thất bại!")
                $('#status-content').removeClass("d-none")
                $('#spinner').addClass("d-none")
                $('#status-content h5').text("Thông tin không hợp lệ hoặc đã tồn tại.")
                $('#close-reg').removeAttr('disabled')
            }
        },'json')
    })
})

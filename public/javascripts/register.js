function onCommonButtonClicked() {
    var targetId = $('#register-id').val();
    if (database.hasUser(targetId)) {
        $('#usable').hide();
        $('#non-usable').show();
    } else {
        $('#usable').show();
        $('#non-usable').hide();
    }
}

$(() => {
    $('#grade')
        .dropdown()
    ;
    
    $('#stype')
        .dropdown({
            onChange: (value, text, $selectedItem) => {
                var interval = 0;
                switch (value) {
                    case "중학교":
                    case "고등학교":
                        interval = 3;
                        break;

                    case "초등학교":
                    case "대학교":
                    default:
                        interval = 6;
                        break;
                }

                var $target = $('#grade');
                $target.empty();

                var option = $('<option value="">학년</option>');
                $target.append(option);

                for (var i = 1; i <= interval; ++i) {
                    option = $('<option value=' + i + '>' + i + '</option>');
                    $target.append(option);
                }
            }
        })
    ;
});
$(() => {
    $('.browse#user')
        .popup({
            popup       : $('.browse#user + .popup'),
            lastResort  : 'bottom right',
            position    : 'bottom right',
            hoverable   : true
        })
    ;

    $('.browse#lectures')
        .popup({
            popup       : $('.browse#lectures + .popup'),
            lastResort  : 'bottom left',
            hoverable   : true
        })
    ;
    
    $('.ui.checkbox')
        .checkbox()
        .first().checkbox({
            onChecked: () => {
                $('.uninverted')
                    .removeClass('uninverted')
                    .addClass('inverted')
                ;
                $('.primary.button .user.icon')
                    .addClass('blue');
                ;    console.log('check');
            },
            onUnchecked: () => {
                $('.inverted')
                    .removeClass('inverted')
                    .addClass('uninverted')
                ;
                $('.primary.button .user.icon')
                    .removeClass('blue');
                ;    console.log('check');
            }
        })
    ;
});
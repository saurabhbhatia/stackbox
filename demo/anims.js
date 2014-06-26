$(document).ready(function() {

    $('#anim-open, #anim-open-speed').on('change', function() {
        setAnimOpenData();
    });
    $('#anim-close, #anim-close-speed').on('change', function() {
        setAnimCloseData();
    });

    function setAnimOpenData() {
        var animOpen = $('#anim-open').val(),
            animOpenSpeed = $('#anim-open-speed').val();

        $('#stackbox-opener').data('stackboxAnimOpen', animOpen + ' ' + animOpenSpeed);
    }
    setAnimOpenData();

    function setAnimCloseData() {
        var animClose = $('#anim-close').val(),
            animCloseSpeed = $('#anim-close-speed').val();

        $('#stackbox-opener').data('stackboxAnimClose', animClose + ' ' + animCloseSpeed);
    }
    setAnimCloseData();

});

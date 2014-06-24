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

        $('#modal-opener').data('modalAnimopen', animOpen + ' ' + animOpenSpeed);
    }
    setAnimOpenData();

    function setAnimCloseData() {
        var animClose = $('#anim-close').val(),
            animCloseSpeed = $('#anim-close-speed').val();

        $('#modal-opener').data('modalAnimclose', animClose + ' ' + animCloseSpeed);
    }
    setAnimCloseData();

});

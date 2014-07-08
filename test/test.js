$(document).ready(function() {

    QUnit.module('Core', {
        setup: function() {
            //$('#open-stackbox').stackbox();
            //$(document).trigger('close.stackbox');
        },
        teardown: function() {
            $('.stackboxes').remove();
        }
    });

    QUnit.test('Elements', function(assert) {

        $('#open-stackbox').stackbox();

        var $mainWrapper = $('.stackboxes');
        assert.strictEqual($mainWrapper.length, 1, 'Only one base wrapper');

        var $wrapper = $mainWrapper.find('.stackbox-wrapper');
        assert.strictEqual($wrapper.length, 1, 'Only one wrapper');

        var $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual($stackbox.length, 1, 'Only one stackbox');

        var $arrow = $wrapper.find('.stackbox-arrow');
        assert.strictEqual($arrow.length, 1, 'Only one arrow');

        var $closeButton = $wrapper.find('.stackbox-close');
        assert.strictEqual($closeButton.length, 1, 'Only one close button');

        var $content = $stackbox.children();
        assert.strictEqual($content.length, 3, 'Three content divs');

        $(document).trigger('close.stackbox');
    });

    QUnit.test('backdrop', function(assert) {

        $('#open-stackbox').stackbox({
            backdrop: true
        });

        var $mainWrapper = $('.stackboxes');
        var $wrapper = $mainWrapper.find('.stackbox-wrapper');

        assert.strictEqual($wrapper.hasClass('stackbox-close-on-backdrop'), true, '.stackbox-close-on-backdrop is set');
        assert.strictEqual($wrapper.hasClass('stackbox-backdrop'), true, '.stackbox-backdrop is set');

        $(document).trigger('close.stackbox');
    });

    // QUnit.asyncTest('Width as number', function(assert) {

    //     // expect(6);

    //     // String
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         width: '543',
    //         afterOpen: function() {
    //             $mainWrapper = $('.stackboxes');
    //             $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //             $stackbox = $wrapper.find('.stackbox');
    //             assert.strictEqual($stackbox.width(), 543, 'Width as string is ok');
    //             QUnit.start();
    //             $('.stackboxes').remove();
    //         }
    //     });

    //     // Number
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         width: 345
    //     });
    //     $mainWrapper = $('.stackboxes');
    //     $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //     $stackbox = $wrapper.find('.stackbox');
    //     assert.strictEqual($stackbox.width(), 345, 'Width as number is ok');
    //     // $(document).trigger('close.stackbox');

    //     // String with unit
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         width: '654px'
    //     });
    //     $mainWrapper = $('.stackboxes');
    //     $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //     $stackbox = $wrapper.find('.stackbox');
    //     assert.strictEqual($stackbox.width(), 654, 'Width + unit is ok');
    //     $(document).trigger('close.stackbox');

    //     // respectBrowserWidth
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         respectBrowserWidth: true,
    //         width: 123456
    //     });
    //     $mainWrapper = $('.stackboxes');
    //     $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //     $stackbox = $wrapper.find('.stackbox');
    //     assert.strictEqual($stackbox.width(), $(window).width() - 34, 'respectBrowserWidth');
    //     $(document).trigger('close.stackbox');

    //     // Min width
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         width: 200,
    //         minWidth: 400
    //     });
    //     $mainWrapper = $('.stackboxes');
    //     $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //     $stackbox = $wrapper.find('.stackbox');
    //     assert.strictEqual($stackbox.width(), 400);
    //     $(document).trigger('close.stackbox');

    //     // Max width
    //     $('#open-stackbox').stackbox({
    //         position: 'absolute',
    //         width: 800,
    //         maxWidth: 400
    //     });
    //     $mainWrapper = $('.stackboxes');
    //     $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //     $stackbox = $wrapper.find('.stackbox');
    //     assert.strictEqual($stackbox.width(), 400);
    //     $(document).trigger('close.stackbox');
    // });

    // QUnit.asyncTest('Close', function(assert) {

    //     $('#open-stackbox').stackbox();

    //     expect(4);

    //     $(document).on('close.stackbox', function() {
    //         assert.ok(true, 'Stackbox Closed');

    //         var $mainWrapper = $('.stackboxes');
    //         var $wrapper = $mainWrapper.find('.stackbox-wrapper');
    //         var $stackbox = $wrapper.find('.stackbox');

    //         assert.strictEqual(0, $stackbox.length);
    //         assert.strictEqual(0, $wrapper.length);
    //         assert.strictEqual(0, $mainWrapper.length);

    //         // $(document).off('close.stackbox');
    //         QUnit.start();
    //     });

    //     $(document).trigger('close.stackbox');
    // });
});

$(document).ready(function() {

    QUnit.module('Core', {
        setup: function() {
            //$('#open-stackbox').stackbox();
        },
        teardown: function() {
            //$(document).trigger('close.stackbox');
        }
    });

    QUnit.test('Elements', function(assert) {

        $('#open-stackbox').stackbox();

        var $mainWrapper = $('.stackboxes');
        assert.strictEqual(1, $mainWrapper.length, 'Only one base wrapper');

        var $wrapper = $mainWrapper.find('.stackbox-wrapper');
        assert.strictEqual(1, $wrapper.length, 'Only one wrapper');

        var $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(1, $stackbox.length, 'Only one stackbox');

        var $arrow = $wrapper.find('.stackbox-arrow');
        assert.strictEqual(1, $arrow.length, 'Only one arrow');

        var $closeButton = $wrapper.find('.stackbox-close');
        assert.strictEqual(1, $closeButton.length, 'Only one close button');

        var $content = $stackbox.children();
        assert.strictEqual(3, $content.length, 'Three content divs');

        $(document).trigger('close.stackbox');
    });

    QUnit.test('backdrop', function(assert) {

        $('#open-stackbox').stackbox({
            backdrop: true
        });

        var $mainWrapper = $('.stackboxes');
        var $wrapper = $mainWrapper.find('.stackbox-wrapper');

        assert.strictEqual(true, $wrapper.hasClass('stackbox-close-on-backdrop'), '.stackbox-close-on-backdrop is set');
        assert.strictEqual(true, $wrapper.hasClass('stackbox-backdrop'), '.stackbox-backdrop is set');

        $(document).trigger('close.stackbox');
    });

    QUnit.test('Width', function(assert) {

        expect(6);

        // Number
        $('#open-stackbox').stackbox({
            position: 'absolute',
            width: 345
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(345, $stackbox.width(), 'Width as number is ok');
        $(document).trigger('close.stackbox');

        // String
        $('#open-stackbox').stackbox({
            position: 'absolute',
            width: '543'
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(543, $stackbox.width(), 'Width as string is ok');
        $(document).trigger('close.stackbox');

        // String with unit
        $('#open-stackbox').stackbox({
            position: 'absolute',
            width: '654px'
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(654, $stackbox.width(), 'Width + unit is ok');
        $(document).trigger('close.stackbox');

        // respectBrowserWidth
        $('#open-stackbox').stackbox({
            position: 'absolute',
            respectBrowserWidth: true,
            width: 123456
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual($(window).width() - 34, $stackbox.width(), 'respectBrowserWidth');
        $(document).trigger('close.stackbox');

        // Min width
        $('#open-stackbox').stackbox({
            position: 'absolute',
            width: 200,
            minWidth: 400
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(400, $stackbox.width());
        $(document).trigger('close.stackbox');

        // Max width
        $('#open-stackbox').stackbox({
            position: 'absolute',
            width: 800,
            maxWidth: 400
        });
        $mainWrapper = $('.stackboxes');
        $wrapper = $mainWrapper.find('.stackbox-wrapper');
        $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(400, $stackbox.width());
        $(document).trigger('close.stackbox');
    });

    QUnit.asyncTest('Close', function(assert) {

        $('#open-stackbox').stackbox();

        expect(4);

        $(document).on('close.stackbox', function() {
            assert.ok(true, 'Stackbox Closed');

            var $mainWrapper = $('.stackboxes');
            var $wrapper = $mainWrapper.find('.stackbox-wrapper');
            var $stackbox = $wrapper.find('.stackbox');

            assert.strictEqual(0, $stackbox.length);
            assert.strictEqual(0, $wrapper.length);
            assert.strictEqual(0, $mainWrapper.length);

            // $(document).off('close.stackbox');
            QUnit.start();
        });

        $(document).trigger('close.stackbox');
    });
});

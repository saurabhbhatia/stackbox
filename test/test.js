$(document).ready(function() {

    QUnit.module('Core', {
        setup: function() {
            $('#open-stackbox').stackbox();
        },
        teardown: function() {
            $(document).trigger('close.stackbox');
        }
    });

    QUnit.test('Elements', function(assert) {

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
    });

    QUnit.asyncTest('Close', function(assert) {
        expect(4);

        $(document).on('close.stackbox', function() {
            assert.ok(true, 'Stackbox Closed');

            var $mainWrapper = $('.stackboxes');
            var $wrapper = $mainWrapper.find('.stackbox-wrapper');
            var $stackbox = $wrapper.find('.stackbox');

            assert.strictEqual(0, $stackbox.length);
            assert.strictEqual(0, $wrapper.length);
            assert.strictEqual(0, $mainWrapper.length);

            $(document).off('close.stackbox');
            QUnit.start();
        });

        $(document).trigger('close.stackbox');
    });
});

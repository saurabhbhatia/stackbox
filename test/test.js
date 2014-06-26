$(document).ready(function() {

    QUnit.module('Core', {
        setup: function() {
            $('#open-stackbox').stackbox();
        },
        teardown: function() {}
    });
    QUnit.test('Stackbox core', function(assert) {

        var $mainWrapper = $('.stackboxes');
        assert.strictEqual(1, $mainWrapper.length, 'Only one base wrapper');

        var $wrapper = $mainWrapper.find('.stackbox-wrapper');
        assert.strictEqual(1, $wrapper.length, 'Only one wrapper');

        var $stackbox = $wrapper.find('.stackbox');
        assert.strictEqual(1, $stackbox.length, 'Only one stackbox');
    });
});

$(document).ready(function() {

    QUnit.module('Core', {
        setup: function() {
            $('#open-stackbox').modalBox();
        },
        teardown: function() {}
    });
    QUnit.test('Stackbox core', function(assert) {

        var $mainWrapper = $('.modals');
        assert.strictEqual(1, $mainWrapper.length, 'Only one base wrapper');

        var $wrapper = $mainWrapper.find('.modal-wrapper');
        assert.strictEqual(1, $wrapper.length, 'Only one wrapper');

        var $modal = $wrapper.find('.modal');
        assert.strictEqual(1, $modal.length, 'Only one modal');
    });
});

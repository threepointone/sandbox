var sandbox = require('./index'),
    __should = require('should');

describe('sandbox', function(){
    it('should add/use a new module', function(done){
        sandbox.add('a', function($){
            $.a=123;
        });

        sandbox.add('b', function($){
            $.b=456;
        });


        sandbox.add('c', function($){
            $.c='gaffe';
        }, {uses:['a', 'b']});


        sandbox().use('c', function($){
            $.a.should.eql(123);
            $.b.should.eql(456);
            $.c.should.eql('gaffe');
            done();
        });
    });
});
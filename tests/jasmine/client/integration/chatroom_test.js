describe('un-authenticated', function() {
  beforeEach(function(done) {
  	Meteor.logout(function() {
  		done();
  	})
  });

  describe('user', function() {
    it('does not see a form', function() {
      expect($("form").length).toEqual(0);
    });
  });
});

describe('authenticated', function() {
  beforeEach(function (done) {
  	// login here
  	Meteor.loginWithPassword("test@test.com", "test", function (err) {
  		Tracker.afterFlush(function() {
  			done();
  		});
  	});
  });

  afterEach(function(done) {
  	Meteor.logout(function() {
  		done();
  	});
  });

  describe('user', function() {
    it('sees form', function() {
      expect($("form").length).toEqual(1);
    });

    describe('onSubmit', function() {
    	beforeEach(function (done) {
    		$("[type=text]").val("Hello World");
    		$("form").submit();
    		Tracker.afterFlush(done);
    	});

    	it('sees message on page', function() {
    		expect($("p").html()).toEqual("Hello World");
    	});
    });
  });
});
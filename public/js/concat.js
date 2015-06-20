// connect to our socket server
var socket = io.connect('http://ec2-52-16-192-128.eu-west-1.compute.amazonaws.com/');

var app = app || {};
// shortcut for document.ready
$(function(){
	//setup some common vars
	var $blastField = $('#blast'),
		$allPostsTextArea = $('#allPosts'),
		$clearAllPosts = $('#clearAllPosts'),
		$sendBlastButton = $('#send'),
        $lastConnected = $('#last-connected'),
        $chat = $('#chat'),
        $identificationPanel = $('#identification-panel'),
        $identityInput = $('#identity'),
        $identityButton = $('#identity-button');

    function identify() {
        socket.emit('identified', {
            name: $identityInput.val()
        }, function () {
            $identificationPanel.addClass('hidden');
            $chat.removeClass('hidden');
        });
    }

    $identityButton.on('click', identify);

    $identityInput.keydown(function (e){
        if(e.keyCode == 13){
            $identityButton.trigger('click');//lazy, but works
        }
    })

    socket.on('new-identified', function (data) {
        var date = new Date(data.timestamp);
        $lastConnected.html('Last identified: ' + data.name + ' at ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    });

	//SOCKET STUFF
	socket.on("blast", function(data){
		var copy = $allPostsTextArea.html();
		$allPostsTextArea.html('<p>' + copy + data.msg + "</p>");
		$allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
		//.css('scrollTop', $allPostsTextArea.css('scrollHeight'));
	});

	$clearAllPosts.click(function(e){
		$allPostsTextArea.text('');
	});

	$sendBlastButton.click(function(e){

		var blast = $blastField.val();
		if(blast.length){
			socket.emit("blast", {msg:blast},
				function(data){
					$blastField.val('');
				});
		}


	});

	$blastField.keydown(function (e){
	    if(e.keyCode == 13){
	        $sendBlastButton.trigger('click');//lazy, but works
	    }
	})

});

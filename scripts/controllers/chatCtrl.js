'use strict';

app.controller('ChatController', function($timeout, $scope, FURL, $firebase, toaster, AuthService) {
    $scope.chat =  "chat";
    var ref = new Firebase(FURL);
    var fbChatMessages = $firebase(ref.child('chatLogs')).$asArray();

    $scope.chatMessages = fbChatMessages;
    do {
        $scope.currentUserId = AuthService.user.uid;
    } while (!$scope.currentUserId);

    $scope.sendMessage = function() {
        console.log(AuthService.user);
        var newMessage = {
            messageText: $("#newMessageText").val(),
            senderName: AuthService.user.profile.name,
            senderType: AuthService.user.profile.type,
            senderId: $scope.currentUserId,
            messageTime: new Date().toLocaleString()
        };

        if (!newMessage.messageText || newMessage.messageText.length == 0) {
            toaster.pop('error', "Please write a message before pressing Send");
        } else {
            fbChatMessages.$add(newMessage);
            $("#newMessageText").val("");
            $timeout(function() {
                document.getElementsByClassName("chat-wrapper")[0].scrollTop = document.getElementsByClassName("chat-wrapper")[0].scrollHeight;
            }, 100);
        }
    }
});
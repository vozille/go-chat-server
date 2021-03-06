var chatVue = new Vue({
    el: '#app',

    data: {
        ws: null, 
        newMsg: '', 
        chatContent: '', 
        email: null, 
        username: null, 
        profileImage: null, 
        joined: false, 
        userSignedIn: false
    },

    created: function() {
        var self = this;
        this.ws = new WebSocket('ws://' + window.location.host + '/websockets');
        this.ws.addEventListener('message', function(e) {
            var msg = JSON.parse(e.data);
            self.chatContent += '<div class="chip">'
                    + '<img src="' + msg.profileImage + '">' // Avatar
                    + msg.username
                + '</div>'
                + emojione.toImage(msg.message) + '<br/>'; // Parse emojis

            var element = document.getElementById('chat-messages');
            element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
        });
    },

    methods: {
        send: function () {
            if (this.newMsg != '') {
                this.ws.send(
                    JSON.stringify({
                        email: this.email,
                        username: this.username,
                        profileImage: this.profileImage,
                        message: $('<p>').html(this.newMsg).text() // Strip out html
                    }
                ));
                this.newMsg = ''; // Reset newMsg
            }
        },

        join: function () {
            if (!this.email) {
                Materialize.toast('You must enter an email', 2000);
                return
            }
            if (!this.username) {
                Materialize.toast('You must choose a username', 2000);
                return
            }
            this.email = $('<p>').html(this.email).text();
            this.username = $('<p>').html(this.username).text();
            this.joined = true;
        },

        gravatarURL: function(email) {
            return 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email);
        },
        logout: function()
        {
            var that = this;
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                that.userSignedIn = false;
                console.log('User signed out.');
            });
        }
    }
});
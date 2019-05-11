
require('./bootstrap');

window.Vue = require('vue');

///For auto scrolling
/*For using vue chat scroll,this is used from this source https://github.com/theomessin/vue-chat-scroll*/ 
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
/*End of For using vue chat scroll,this is used from this source https://github.com/theomessin/vue-chat-scroll*/

///For notifications
/*For using v-toaster,this is used from this source https://github.com/paliari/v-toaster*/ 
//import Vue from 'vue' //it is commented because we use it once in the vue chat scroll
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})// optional set default timeout, the default is 10000 (10 seconds).
/*End of For using v-toaster,this is used from this source https://github.com/paliari/v-toaster*/


Vue.component('message',require('./components/message.vue').default);


const app = new Vue({
    el: '#app',
    data:{
    	message:'',
    	chat:{
    		message:[],
            user:[],
            color:[],
            time:[],
    	},
        typing:'',
        numOfUsers:0,
    },
    watch:{
        message(){
            Echo.private('chat')
            .whisper('typing', {
                name: this.message
            });
        }
    },
    methods:{
    	send(){
    		if(this.message.length != 0){
                this.chat.message.push(this.message);
                this.chat.user.push('you');
                this.chat.color.push('success');
    			this.chat.time.push(this.getTime());
                axios.post('send', {
                    message: this.message,
                    chat: this.chat,
                })
                .then(response => {
                    console.log(response);
                    this.message = '';
                })
                .catch(error => {
                    console.log(error);
                });
    		}
    	},
        getTime(){
            let time = new Date();
            return time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
        },
        getOldMessages(){
            axios.post('getOldMessages', {
                message: this.message,
                chat: this.chat,
            })
            .then(response => {
                console.log(response);
                if(response.data != '')
                {
                   this.chat = response.data;
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteSession(){
            axios.post('deleteSession')
            .then(response => {
                this.$toaster.success('Chat history is deletd.');
            });
        }

    },
    mounted(){
        this.getOldMessages();
    	Echo.private('chat')
	    .listen('ChatEvent', (e) => {
            this.chat.message.push(e.message);
            this.chat.user.push(e.user);
            this.chat.color.push('warning');
            this.chat.time.push(this.getTime());
	        console.log(e);
            axios.post('saveToSession', {
                chat: this.chat,
            })
            .then(response => {
                
            })
            .catch(error => {
                console.log(error);
            });
	    })
        .listenForWhisper('typing', (e) => {
            if(e.name != ''){
                this.typing = 'typing';
            }
            else{
                this.typing = '';
            }
        });
        Echo.join('chat')
        .here((users) => {
            this.numOfUsers = users.length;
            //console.log(users);
        })
        .joining((user) => {
            this.numOfUsers += 1;
            //console.log(user.name);
            this.$toaster.success(user.name+' is joined the chat room');
        })
        .leaving((user) => {
            this.numOfUsers -= 1;
            //console.log(user.name);
            this.$toaster.warning(user.name+' is leaved the chat room');
        });
    }
});

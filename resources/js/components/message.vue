<template>
    
    <div>
        <li class="list-group-item" :class="listItemColor"><slot></slot>
        <span id="time">{{time}}</span>
        </li>
        
        <small class="badge float-right" :class="badgeColor">{{user}}</small>
    </div>
    
</template>

<script>
    export default {
        props:[
            'color',
            'user',
            'time',
        ],
        computed:{
            listItemColor(){
                return "list-group-item-"+this.color;
            },
            badgeColor(){
                return "badge-"+this.color;
            }
        },
    }
</script>
<style>
    #time{
        font-size:12px;
        margin-top: 100px;
        color:black;
    }
</style>

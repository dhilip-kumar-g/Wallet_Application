<template>
    <div v-if="true" class="head" >
       
        
        <img id="photo" src="../assets/logo.png" alt="User image">
        
    </div>
    
    
</template>

<script>

export default {

    name : 'HeaderFile',
    props:['credit','debit','ToggleAdd','ToggleNotesSearch','ToggleUserSearch']
}
</script>

<style scoped>
    .head{
        margin:0px;
        position:relative;
        
    }
    #photo{

        height:200px;
        width:200px;
        position:relative;
        left:1300px;
        border:2px solid black;
        margin-top:0;
        display:flex;

    }
    p{

        font-size:28px; 
        margin-top:0px;
    }
</style>
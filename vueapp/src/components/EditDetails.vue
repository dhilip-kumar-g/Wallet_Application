<template>
    
    <div>
        <slot />
        <input type="text" id="note" placeholder="Note"/><br>
        <input type="number" id="amount" placeholder="amount"/>
        <button>Edit</button><button @click="TogglePopup()">close</button>
    </div>
    
    
</template>

<script>

export default {

    name : 'EditDetails' ,
    props:['TogglePopup']
}
</script>

<style lang="scss" scoped>
.popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	background-color: rgba(0, 0, 0, 0.2);
	
	display: flex;
	align-items: center;
	justify-content: center;
	.popup-inner {
		background: #FFF;
		padding: 32px;
	}
}
</style>
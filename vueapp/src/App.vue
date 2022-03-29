<template>
  
  <HeaderFile />
  <div v-if="visible" class="control">
  <button @click="toggle"> Add </button>
  <button @click="show"> View </button>
  <button @click="edit"> Edit </button>
  <button @click="erase"> Delete </button>
  </div>

  <div v-if="!visible" class="insert">

    <label for="note">Note</label>
    <input type="text" id="note"/><br/><br/>
    <label for="amount">Amount</label>
    <input type="number" id="amount"/><br/><br/>
    <button id="submit" value="Submit" @click="myfunction">submit</button>

  </div>

   <div>
  <table class="table table-striped">
  <thead>
    <tr>
      <th>sl_no</th>
      <th>Note</th>
      <th>Amount</th>
      <th>Date</th>
      
    </tr>
  </thead>
  <tbody>
    <tr v-for="(file,i) in data" :key="i">
       <th scope="row">{{ i+1 }}</th> 
       <td>{{ file.note }}</td> 
       <td>{{ file.amount }}</td> 
       <td>{{ file.date }}</td>
    </tr>
   </tbody>
</table>
  </div>

</template>

<script>
import axios from 'axios'
import HeaderFile from './components/HeaderFile.vue';
export default {

  name: 'app',
  props: ['note','amount'],
  components:{

      HeaderFile
  },
  data(){
        return {

            visible:true,
            data:"",
      }
  },
  methods:{

      myfunction: function(){
      
            const note =  document.getElementById("note").value
            const amount = document.getElementById("amount").value
            const data = {note,amount}
            console.log(data)
            axios.post('http://localhost:3000/notes',data)
              .then(response=> console.log(response))
              .then(error=>console.log(error))

      },
      show: async function()
      {

              await axios.get('http://localhost:3000/notes')
              .then(response=> {
                this.data = response.data
                console.log(response.data)
                console.log("typeof data" + typeof (this.data))
                for(let i=0;i<this.data.length;i++)
                  console.log(this.data[i])
              })
              .then(error=>console.log(error))
        
      },
      toggle(){
        this.visible = !this.visible
      },
      erase()
      {
          let data="test"
          axios.delete('http://localhost:3000/notes',data)
              .then(response=> console.log(response))
              .then(error=>console.log(error))
      },
      edit()
      {
          let data ={

              "note":"testtest",
              "amount":500
          }
          axios.put('http://localhost:3000/notes',data)
              .then(response=> console.log(response))
              .then(error=>console.log(error))
      }
  }
}
</script>

<style>

  .control{

    position : relative;
    top:300px;
    left:500px; 
  }
  .control button{

    border:0;
    background-color:green;
    height:30px;
    width:100px;
    margin-left:20px;
    margin-right:80px;
  }
  

</style>


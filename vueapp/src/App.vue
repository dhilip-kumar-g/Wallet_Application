<template>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Wallet</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#" @click="ToggleAdd">Add</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#" @click="ToggleNotesSearch">NotesFilter</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#" @click="ToggleUserSearch">UserFilter</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#" @click="checkBalance">checkBalance</a>
        </li>
        </ul>

    </div>
  </div>
</nav>
  
<!--
  <button @click="ToggleAdd">Add</button>
  <button @click="ToggleNotesSearch">NotesFilter</button>
  <button  @click="ToggleUserSearch">UserFilter</button>
  <button @click="checkBalance">checkBalance</button-->
  <div class="insert">
    <!--h2> Current Balance </h2><h2 id="balance"> {{currentBalance}} </h2-->
    <div class="user" v-if="userView">
      <input type="text" id="user" placeholder="username"/> &nbsp;&nbsp;
    </div>
    <div class="email" v-if="emailView">
      <input type="text" id="email" placeholder="Email"/> &nbsp;&nbsp;
    </div>
    <div class="input" v-if="inputView">
      <input type="text" id="note" placeholder="Note"/>&nbsp;&nbsp;
    </div>
    <div class="amount" v-if="amountView">
      <input type="number" id="amount" placeholder="amount"/>&nbsp;&nbsp;
    </div>
    <div class="add" v-if="addView">
      <button @click="credit">credit</button>&nbsp;&nbsp;
      <button @click="debit">debit</button>
    </div>
    <div class="searchnotes" v-if="searchnotesView">
      <button  @click="searchNotes">NotesFilter</button>
    </div>
    <div class="searchuser" v-if="searchuserView">
      <button @click="searchUser">UserFilter</button>
    </div>
    <div v-if="EditView">
      <button @click="edit()">OK</button>&nbsp;&nbsp;
      <button @click="canceledit()">cancel</button>
    </div>
    

  </div>

   <div v-if=!isBalanceClicked>
  <table  class="table table-hover table-responsive mx-auto w-50 tableFixHead">
  <thead>
    <tr>
      <th>sl_no</th>
      <th>username</th>
      <th>email</th>
      <th>action</th>
      <th>Note</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(file,i) in data" :key="i">
       <td>{{ i+1 }}</td> 
       <td>{{file.username}}</td>
       <td>{{file.email}}</td>
       <td>{{file.action}}</td>
       <td>{{ file.note }}</td> 
       <td>{{ file.amount }}</td> 
       <td>{{ file.date }}</td>
       <td><button @click="editStep1(i,file.sl_no,file.note,file.amount)"> Edit </button></td>
       <td><button @click="erase(file.sl_no)"> Delete</button></td>
    </tr>
   </tbody>
</table>
  </div>

  <div v-if=isBalanceClicked>
  <table class="table table-hover table-responsive mx-auto w-auto tableFixHead">
  <thead>
    <tr>
      <th>sl_no</th>
      <th>username</th>
      <th>Balance</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(file,i) in balance" :key="i">
       <td>{{ i+1 }}</td> 
       <td>{{file.username}}</td>
       <td>{{file.balance}}</td>
      
    </tr>
   </tbody>
</table>
  </div>

</template>

<script>
console.log(Notification.permission)
//:data="data"
//@click="edit(i,file.sl_no,file.note,file.amount)"
import axios from 'axios'
//import HeaderFile from './components/HeaderFile.vue';
//import EditDetails from './components/EditDetails.vue';

export default {

  name: 'app',
  components:{
   // HeaderFile,
  //  EditDetails
  },
  data(){
    return {
    
      Editdata:"",
      data:"",
      currentBalance:0,
      isBalanceClicked:false,
      creditbalance:[],
      debitbalance:[],
      balance:"",
      buttonTrigger:false,
      userView:false,
      inputView:false,
      addView:false,
      searchnotesView:false,
      searchuserView:false,
      EditView:false,
      emailView:false,
      amountView:false
    }
  },
  methods:{
      TogglePopup(){

        this.buttonTrigger=!this.buttonTrigger
      },
      ToggleAdd(){
        this.isBalanceClicked=false
        this.emailView=true
         this.show()
         this.inputView = true
         this.amountView = true
         this.addView = true
         this.userView = true
        this.searchnotesView=false
        this.searchuserView=false
        this.EditView=false
      },
      ToggleNotesSearch(){
        this.isBalanceClicked=false
         this.show()
        this.inputView = true
        this.searchnotesView = true
        this.amountView=false
        this.addView=false
        this.searchuserView=false
        this.userView=false
        this.EditView=false
        this.emailView=false
      },
      ToggleUserSearch(){
        this.isBalanceClicked=false
         this.show()
        this.userView = true
        this.searchuserView = true
        this.addView=false
        this.inputView = false
        this.searchnotesView = false
        this.EditView=false
        this.emailView=false,
        this.amountView=false
      },
      
      


      getBalance: async function(){
        let balanceObj = {}
       // console.log(this.creditbalance)
        this.creditbalance.forEach(c => {
          if(!balanceObj[c.username])
            balanceObj[c.username] = 0
          balanceObj[c.username] = parseInt(balanceObj[c.username])+parseInt(c.sum)
        })
        this.debitbalance.forEach(c => {
          if(!balanceObj[c.username])
            balanceObj[c.username] = 0
          balanceObj[c.username] = parseInt(balanceObj[c.username])-parseInt(c.sum)
        })

        this.balance = []
        for(let b in balanceObj) {
          this.balance.push({
            username: b,
            sum: balanceObj[b]
          })
        }
      },
      putBalance: async function()
      {
          await axios.put(`http://localhost:3000/balance`,{balance:this.currentBalance})
              .then(response=> console.log(response))
              .catch(error=>console.log(error))


      },
      credit: function(){
        const note =  document.getElementById("note").value
        const amount = document.getElementById("amount").value
        const user = document.getElementById("user").value
        const email = document.getElementById("email").value
        
        let data = {

            note:note,
            amount:amount,
            user:user,
            action:"credit",
            email:email

        }
        console.log(data)
        axios.post('http://localhost:3000/notes',data)
          .then(response=> {
            console.log(response)
            this.data.push(response.data.data)
          })
          .catch(error=>console.log(error))
      },
      debit: function(){
        const note =  document.getElementById("note").value
        const amount = document.getElementById("amount").value
        const user = document.getElementById("user").value
        const email = document.getElementById("email").value
        let data = {

            note:note,
            amount:amount,
            user:user,
            action:"debit",
            email:email

        }
       // console.log(data)
        axios.get(`http://localhost:3000/balance/${user}`)
        .then(res=>{
            console.log(res);
            axios.post('http://localhost:3000/notes',data)
            .then(response=> {
              console.log(response)
              this.data.push(response.data.data)
            })
            .catch(error=>{
              console.log(error.msg)
              alert("insufficient Balance cannot debit")
              })
              //console.log("below balance",res.data)

        }).catch(err=>{
          alert(err.msg)
          console.log(err)})
        
        
      },
      show: async function()
      {
              await axios.get('http://localhost:3000/notes')
              .then(response=> {
                this.data = response.data
              })
              .catch(error=>console.log(error))
        
      },
      erase(val)
      {
    
          console.log(val)
          if(confirm("Do you want to delete?")){

              axios.delete(`http://localhost:3000/notes/${val}`)
              .then(response=> {
                console.log(response)
                this.data = this.data.filter(d => d.sl_no != val)
              })
              .catch(error=>console.log(error))
          }
          
      },
      editStep1(index,a,b,c)
      {
        this.inputView = true
        this.searchnotesView = false
        this.amountView=true
        this.addView=false
        this.searchuserView=false
        this.userView=false
        this.EditView=true
        this.emailView=false
        this.Editdata = {
          sl_no : a,
          note : b,
          amount : c,
          index : index

        }
      },
      edit()
      {
         
           var note =  document.getElementById("note").value
           var amount = document.getElementById("amount").value
           console.log("passing")
           //console.log(a,b,c)
          var index = this.Editdata.index
          if(note === '')
            note = this.Editdata.note
          if(amount==='')
            amount=this.Editdata.amount
        //  console.log(a,note,amount)
           let data ={

              sl_no:this.Editdata.sl_no,
              note:note,
              amount:amount
          }
          console.log(data.sl_no)
          axios.put('http://localhost:3000/notes',data)
              .then(response=> console.log(response))
              .catch(error=>console.log(error))
          this.data[index].note = note
          this.data[index].amount = amount
         // console.log(this.data[index])
      },
      canceledit()
      {
          document.getElementById("note").value=""
          document.getElementById("amount").value=""
          this.inputView = false
          this.searchnotesView = false
          this.amountView=false
          this.addView=false
          this.searchuserView=false
          this.userView=false
          this.EditView=false
          this.emailView=false
          this.emailView=false
      },
  
      searchNotes: async function()
      {
         
          const note =  document.getElementById("note").value
          this.data = this.data.filter(d => d.note === note)

      },
      searchUser: async function()
      {
          const user =  document.getElementById("user").value
           await axios.get(`http://localhost:3000/notes/${user}`)
                   .then(response=> {
                     //console.log(typeof response.data.data)
                  //   console.log(response.data)
                    // var temp = JSON.stringify(response.data) 
                   //  console.log(response)
                    //  const obj = JSON.parse(response.data.data);
                     // const obj = JSON.parse(response.data).data.data;
                   //  const obj = JSON.parse(response.data)
                     this.data=response.data.data
                    // console.log(this.data)
                    // console.log(this.data.length)
                   })
                   .catch(error=>console.log(error))
         // this.data = this.data.filter(d => d.user === user)

      },
      
      checkBalance: async function()
      {
        this.isBalanceClicked = true   
        this.userView=false
        this.inputView=false
        this.addView=false
        this.amountView=false
        this.searchnotesView=false
        this.searchuserView=false
        this.balanceView=false
        this.emailView=false
        this.EditView=false
        await axios.get('http://localhost:3000/balance')
              .then(response=> {
               console.log(response.data[0])
                this.balance = response.data
              }).catch(error=>console.log(error))
      }
  },
  beforeMount(){
        this.show()
        this.getBalance()
      }
}
</script>

<style>
/*.table-responsive {
    max-height:300px;
    overflow:scroll;
}*/
thead, tbody
{
  display:block;
    table-layout: fixed;
}
thead{
  
  margin-top:50px;
  /*text-align:center;*/
}
tbody 
{
   overflow-y: auto;
  
   height: 400px;
}
thead tr{
  display:flex;
  justify-content:space-between;
}
thead td{
  padding: 0.5rem 0.5rem;
}
.insert{

  position:relative;
  left:500px;
  display:flex;
  margin-top: 200px;
}
/*  .control{

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

  .insert{

    margin-left:500px;
    margin-top:50px;


  }
  table{

    align:center;
    margin-left:500px;
    border:2px solid black;
    text-align: center;
  }
  th, td {
  padding: 15px;
  text-align: center;
  border-bottom:1px solid #ddd;
  }
  thead, tbody { display: block; }

  tbody {
      height: 300px;       
      overflow-y: auto;    
      overflow-x: hidden;  
  }
*/
@import'~bootstrap/dist/css/bootstrap.css'
</style>


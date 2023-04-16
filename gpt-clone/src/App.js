
import { useEffect, useState } from 'react';
import './App.css';


function App() {

  const [value,setValue]=useState(null)
  const [message,setMessage]=useState(null)
  const [prevChats,setPreviousChats]=useState([])
  const [currTitle,setCurrTitle]=useState(null)

  const createNewChat=()=>{
    setMessage(null)
    setValue("")
    setCurrTitle(null)
  }

  const handleClick=(uniqueTitle)=>{
    setCurrTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages=async()=>{
    const options={
      method:"POST",
      body:JSON.stringify({
        message:value
      }),
      headers:{
        "Content-Type":"application/json",
      }
    }
    try{
      const response=await fetch("http://localhost:8000/completions",options)
      const data= await response.json()
      // console.log(data) 
      setMessage(data.choices[0].message)
    }catch(err){
      console.error(err)
    }
  }
// console.log(message)
useEffect(()=>{
  console.log(currTitle,value,message)
  if(!currTitle && value && message ){
    setCurrTitle(value)
  }
  if(currTitle && value && message){
    setPreviousChats(prevChats=>(
      [...prevChats, {
        title:currTitle,
        role:"User",
        content:value
      },
      {
        title:currTitle,
        role:message.role,
        content:message.content
      }
    ]
    ))
  }
},[message,currTitle])
console.log(prevChats)

const currChat= prevChats.filter(prevChats=>prevChats.title==currTitle)
const uniqueTitle=Array.from(new Set(prevChats.map(prevChats=>prevChats.title)))
console.log(uniqueTitle)
  return (
    <div className="app">
      <section className='side-bar'>
        <button onClick={createNewChat} >+ New Chat</button>
        <ul className='history' >
          {uniqueTitle?.map((uniqueTitle,index)=><li key={index} onClick={()=>handleClick(uniqueTitle)} >{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Beardo</p>
        </nav>
      </section>

      <section className='main'>
          {!currTitle && <h1>BeardoGPT</h1>}
          <ul className='feed' >
            {currChat.map((chatMessage, index)=><li key={index}>
              <p className='role' >{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>)}
          </ul>
          <div className='bottom-section' >
            <div className='input-container' >
              <input value={value} onChange={(e)=>setValue(e.target.value)} />
              <div id='submit' onClick={getMessages} > ➢ </div>
            </div>
            <p className='info' >
            ChatGPT Mar 23 Version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </p>

          </div>
      </section>
    </div>
  );
}

export default App;

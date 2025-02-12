import {useEffect,useState} from "react";
import {getDocs,collection,query,where, addDoc, doc,  getDoc} from 'firebase/firestore';
// import supabase from './supabase';
import "./style.css";
import { db } from "./config/firebase";

// const initialFacts = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//     source:
//       "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//     category: "society",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
// ];

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function App() {
  const [showForm,setShowForm]=useState(false);
  const [facts,setFacts]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [currentCategory,setCurrentCategory]=useState("all");

  // let factRef=collection(db,"facts");

  // useEffect(function() {
  //   async function getFacts(){
  //     setIsLoading(true);


  //     let query=supabase.from("facts").select("*");

  //     if(currentCategory!=="all") query =query.eq("category",currentCategory);


  //   let { data: facts, error } = await query
  //  .order("votesInteresting",{ascending:false}).limit(1200);

  // if(!error) setFacts(facts);
  // else alert("there was a problem getting data");
  //  setIsLoading(false);
  //     }
  //     getFacts();
  //     },[currentCategory]);

  useEffect(function() {

      const getFacts=async()=>{
        setIsLoading(true);
        let factRefee= collection(db,"facts");
        try{
        let fetchedFacts;
        if(currentCategory==="all")
          fetchedFacts = await getDocs(factRefee);
        else{
          console.log(currentCategory);
          let factQuery= query(factRefee,where('category','==',currentCategory));
          fetchedFacts= await getDocs(factQuery);
        } 
       
        const fetchedFactsArray= fetchedFacts.docs.map((doc)=>({...doc.data(),id:doc.id}));
        setFacts(fetchedFactsArray);
        }
        catch(error){
          alert(error.message);
        }
        setIsLoading(false);
      }
      getFacts();
      
      },[currentCategory]);

  return (
    <>
    <Header showForm={showForm} setShowForm={setShowForm} />
    {showForm?<NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> :null}


      <main className="main">
      <CategoryFilter setCurrentCategory={setCurrentCategory}/>  
        {isLoading ?<Loader />:<FactsList facts={facts} setFacts={setFacts}/>}
   
      </main>
      </>
  );
}

function Loader(){
  return <p className="message">loading....</p>;
}

function Header({showForm,setShowForm}){
  return (
    <header className="header" >  
    <div className="logo">
    <img src="logo.png" height="68" width="68" alt=""/>
    <h1>Fact Spectrum</h1> {/* today i learned real
    */}
    </div>
    <button className="btn btn-open" onClick={()=>setShowForm((show)=>!show)}>{showForm?'close':'Share a Fact'}</button>
    </header>

  );
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}



function NewFactForm({setFacts,setShowForm}){
  const [text,setText]=useState("");
  const [source,setSource]=useState("");
  const [category,setCategory]=useState("");
  const [isUploading,setIsUploading]=useState(false);
  const textLength=text.length;

 const handleSubmit=async (e)=>{

  e.preventDefault();
  if (!text || textLength > 200) {
      alert("Text length should be less than 200 characters");
      return;
    } else if (!category) {
      alert("Choose a category");
      return;
    } else if (!isValidHttpUrl(source)) {
      alert("Source should start with https://");
      return;
    }
     

  else if(text && isValidHttpUrl(source) && category && textLength<200){
//3,create a fact 
/*const newFact=
{
  id:Math.round(Math.random()*10000000),
  text ,
  source ,
  category ,
  votesInteresting: 0,
  votesMindblowing: 0,
  votesFalse: 0,
  createdIn: new Date().getFullYear(),
};*/
//3.upload the fact to firebase
setIsUploading(true);
try{
  const factRefBlock= collection(db,"facts");
  const newFact=  await addDoc(factRefBlock,{text,source,category,votesInteresting: 0,
    votesMindblowing: 0,
    votesFalse: 0,
    createdIn: new Date().getFullYear()});
  console.log(newFact);
}
catch(e){
  alert(e.message);
}

setIsUploading(false);
  setText("");
  setSource("");
  setCategory("");
    //6 close form
  setShowForm(false);
  }
  else{
    alert("give valid input");
  }
}

  return (
  <form className="fact-form" onSubmit={handleSubmit}>
  <div className="inner-fact">    
  <input type="text" placeholder="Share a fact with world..."
      value={text}
      onChange={(e)=>setText(e.target.value)}
      disabled={isUploading}
  />
  <span>{200-textLength}</span>
  <input type="text" placeholder="source https://google.com/"
    value={source}
    onChange={(e)=>{setSource(e.target.value)}}
    disabled={isUploading}
  />
  <select value={category} onChange={(e)=>setCategory(e.target.value)} disabled={isUploading}>
      <option value="">Choose category:</option>
      {CATEGORIES.map((categor)=>(
        <option key={categor.name} value={categor.name}>{categor.name.toUpperCase()}</option>
      ))}
      
  </select>
</div>

  <button className="btn post-btn" disabled={isUploading}>POST</button>
  </form>);
}

function CategoryFilter({setCurrentCategory}){
    return ( 
    <aside>
      <ul>
      <li className='category'><button className="btn btn-all-categories" onClick={()=>setCurrentCategory("all")}>All</button></li>
        {CATEGORIES.map((cat)=> (<li key={cat.name} className="category">
          <button className="btn btn-category" style={{backgroundColor:cat.color}}
          onClick={()=>setCurrentCategory(cat.name)}>
          {cat.name}
          </button>
          </li>))}
        
      </ul>
    </aside>
    
    );
}

function FactsList({facts, setFacts}){
  if(facts.length ===0){
    return <p className="message">No facts for this  category yet</p>;
  }
  
  return (
    <section className="section">
    <ul className="facts-list">
      {facts.map((fact)=>(
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
      ))}
    </ul>
    </section>
  )
}

function Fact({fact,setFacts}){
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindBlowing < fact.votesFalse;
  const handleVote=async(columnName)=>{
    setIsUpdating(true);
    try{
      console.log("factId",fact.id);
    const factDoc= doc(db,"facts",{id:fact.id});
    console.log(factDoc);
    const getColumnValue= await getDoc(factDoc);
    console.log(getColumnValue.docs);
    // await updateDoc(factDoc,{columnName:getColumnValue+1});
    // console.log("updated");
    }
    catch(e){
      alert(e.message);
    }
    setIsUpdating(false);
  }

  return (
    
    <li  className="fact"> 
          <p className="para">
          {isDisputed ? <span className='disputed'>[⛔️ DISPUTED]</span> : null}
            {fact.text}
              <a href={fact.source} className="source" >(Source)</a>
          </p>
      <div className="tag-div">    <span className ="tag" style={{backgroundColor:CATEGORIES.find((cat)=>cat.name===fact.category).color,}}>{fact.category}</span></div>
          <div className="vote-buttons"> 
              <button onClick={() => handleVote('votesInteresting')}
          disabled={isUpdating}>👍{fact.votesInteresting}</button>
              <button onClick={() => handleVote('votesMindBlowing')}
          disabled={isUpdating}>🤯{fact.votesMindblowing}</button>
              <button onClick={() => handleVote('votesFalse')} disabled={isUpdating}>⛔️{fact.votesFalse}</button>
          </div>   
  </li> 
  )
}


export default App;




// Imported packages
import express from 'express'
import dotenv from 'dotenv'
import {createClient} from '@supabase/supabase-js'
// Middleware
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY

)
// Static files
app.use(express.static('public'))
app.use(express.json())


// Call to fetch data from DB
app.get('/exercises', async(req, res) =>{
    //console.log(req.query)
    const { level = [], equipment =[], primaryMuscles = [], category= [] } = req.query
    
    const levels = Array.isArray(level) ? level : [level]
    const equips = Array.isArray(equipment) ? equipment : [equipment]
    const muscles = Array.isArray(primaryMuscles) ? primaryMuscles : [primaryMuscles]
    const categs = Array.isArray(category) ? category : [category]
  //  console.log(levels)
    //todo: parse data rom db
    let query= supabase.from('exercises')
                        .select(' id,name, level,equipment,  primaryMuscles, category') 

    if(levels.length > 0 && levels.length < 3){
        query = query.in(`level`, levels)

    }
    const wantsBodyOnly = equips.includes('Body Only')
    const wantsEquipReq = equips.includes('Equipment Required')

if(wantsBodyOnly && !wantsEquipReq){
    query = query.eq('equipment', 'Body Only')
}

if(!wantsBodyOnly && wantsEquipReq){
    query = query.neq('equipment', 'Body Only')
}

     if(muscles.length > 0 && muscles.length < 17){
        query = query.in(`primaryMuscles`, muscles)

    }
     if(categs.length > 0 && categs.length < 7){
        query = query.in(`category`, categs)

    }
    const {data, error} = await query
    if(error){
        console.error('Supabase error:', error)
        return res.status(500).json({error: error.message})
    }
    //  console.log(data)
    res.json(data)
})


app.get ('/exercises/random', async(req, res)=>{
    const { workoutType = 'bodyweight', exerciseCount= 5 } =req.query
    console.log('workoutType:', workoutType)
console.log('count received:', exerciseCount)
console.log('count type:', typeof exerciseCount)
    let query = supabase
    .from('exercises')
    .select('*')

        if(workoutType === 'bodyweight'){
         query = query.eq('equipment', 'Body Only')
        }else if(workoutType === 'equipment'){
          query = query.neq('equipment', 'Body Only')
        }

        const { data, error }= await query
        if(error){
        console.error('Supabase error:', error)
        return res.status(500).json({error: error.message})
    }

     if (!data || data.length === 0) {
        return res.json([]) 
    }
    const arr = [...data]
    for(let i = arr.length-1; i> 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
        [arr[i],arr[j]] = [arr[j], arr[i]]
    }

    const limit = Number(exerciseCount) || 5
    const randomized = arr.slice(0, limit)   
    
    console.log(randomized)

return res.json(randomized)

})

app.post('/workout_plan', async(req, res)=>{
const { plan_name, exercises } = req.body
const {data, error} = await supabase.from('workout_plan'). insert({
     plan_name: plan_name,
     exercises :exercises
}).select()
if(error){
        console.error('Supabase error:', error)
        return res.status(500).json({error: error.message})
    }
    res.json(data)

 })

app.get('/exercises/:id', async(req, res) =>{

    const { id } = req.params
    const { data,error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .maybeSingle()

    if(error){
        console.error('Supabase error:', error)
        return res.status(500).json({error: error.message})
    }
    if(!data){
        return res.json(null)
    }
    //  console.log(data)
    res.json(data)
})





app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})


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
app.get('/exercises/:id', async(req, res) =>{

    const { id } = req.params
    const { data,error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()

    if(error){
        console.error('Supabase error:', error)
        return res.status(500).json({error: error.message})
    }
    //  console.log(data)
    res.json(data)
})



app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})


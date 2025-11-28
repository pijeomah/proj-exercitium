let currentExercises= []
const saveBtn = document.getElementById('sv-workout-btn')
saveBtn.style.display = 'none'
saveBtn.addEventListener('click', ()=> {
    const workoutName = prompt('Enter your workout name:')
    console.log(workoutName)
    console.log(currentExercises)
})

if(!workoutName){
    return 'No workouts have been saved'
}
try {
    const workoutSaved = await fetch('exercises/workout-plan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json,charset=utf-8'},
        body: JSON.stringify({plan_name: plan_name, exercises: exercises})
    })
    let result = await workoutSaved.json()
    console.log(result)

} catch (error) {
     console.error(`Error posting exercises`, error)
        document.getElementById('workout-result').innerHTML =`<li style="color: red">Failed to post exercises</li>`
}

document.getElementById('generator-form').addEventListener('submit', async(e)=> {
    e.preventDefault()

    const form= e.target
    const formData = new FormData(form)

    const workoutType = formData.get('workoutType')
    const exerciseCount = formData.get('exerciseCount')
    // console.log(workoutType)
    // console.log(exerciseCount)
    const params = new URLSearchParams()
    formData.forEach((value, key) =>{
        params.append(key, value)
        
    })
    try {
        const res = await fetch('/exercises/random?' + params.toString())

      
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
            const exercises = await res.json()
        console.log(exercises)
        const ul = document.getElementById('randomList')
       
        if(exercises.length === 0){
            saveBtn.style.display = 'none'
            ul.innerHTML = `<li>No exercises found</li>`
        }else{
            currentExercises = exercises
              saveBtn.style.display = 'block'
            ul.innerHTML = exercises.map(exercise => {
              
                return `<li>
                <a href="exercise.html?id=${encodeURIComponent(exercise.id)}" target="_blank">
                <strong>${exercise.name}</strong><br/></a>
                Level:  ${exercise.level},
                Equipment: ${exercise.equipment ? exercise.equipment : 'None'},
                Category: ${exercise.category},
                Primary Muscle: ${exercise.primaryMuscles}
                </li>`
            }).join('')
        }



    } catch (error) {
        console.error(`Error fetching exercises`, error)
        document.getElementById('randomList').innerHTML =`<li style="color: red">Failed to load exercises</li>`
    }

})
(async() =>{
    async function deleteWorkout(workoutId) {
        console.log(workoutId)
        console.log (typeof workoutId)
        try {
              
        const response = await fetch(`/workout_plan/${workoutId}`, {
            method: `DELETE`,
            headers: {
                'Content-Type': 'application/json'
            },
            
        })

        if(!response.ok){
        throw new Error(`HTTP ${response.status}`)
            }

            console.log(response)
            console.log(response.status)

        alert( `Download deleted successfully!`)
        location.reload()
        } catch (error) {
              console.error(`Failed to delete workout`, error)
              console.error('Error name:', error.name)
        console.error('Error message:', error.message)
                alert('Failed to delete workout. Please try again.')
        }
        
        
    }
    const container = document.getElementById('workout-container')

    try {
        const res = await fetch('/workout_plan')
        if(!res.ok) throw new Error (`HTTP ${res.status}`)
            const workouts = await res.json()
        if(workouts.length === 0){
           container.innerHTML = `<div>No workouts found. <a href="generator.html">Generate your first workout!</a> </div> `
           return
        }else{
            container.innerHTML = workouts.map
            (workout => {
                return `
                <div style="border: 1px solid #ccc; padding: 1rem; margin: 1rem 0; border-radius: 5px;">
                <h2>${workout.plan_name}</h2> <br/> <p>Number of exercise: ${workout.exercises.length}</p><br/>
                <p>Date of workout creation: ${new Date(workout.created_at).toLocaleDateString()}</p>
                <details>
                <summary>
                View Exercises
                </summary>
                    <ul>
                        ${workout.exercises.map(ex  => 
                    `<li>
                        <strong>${ex.name}</strong><br/>
                        Level: ${ex.level},
                        Equipment: ${ex.equipment || 'None'},
                        Primary Muscle: ${ex.primaryMuscles}
                    </li>
                    `).join('')}               
                </ul>
                </details>
                <button data-id=${workout.id} style="background-color: #dc3545; color: white; border-radius: 5px;" class="delete-btn"> Delete Workout</button>
           </div>`            
            }).join('')
            const deleteBtns = document.querySelectorAll('.delete-btn')
            deleteBtns.forEach( button => {
                button.addEventListener('click', async()=>{
                    const workoutId = button.dataset.id

                    const workoutCard =button.closest('div[style*="border"]')
                    const workoutName = workoutCard.querySelector('h2').textContent

                    const confirmed= confirm(`Are you sure you want to delete "${workoutName}"? This cannot be reversed`)
                    if(confirmed){
                        await deleteWorkout(workoutId)
                    }

                })
            })
        }
    } catch (error) {
        console.error('Error fetching workouts:', error)
        container.innerHTML = `<p style="color: red;">Failed to load workouts. Please try again.</p>`
    }
})()
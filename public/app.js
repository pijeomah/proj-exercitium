// Fetch data and format data results as html
document.getElementById("filterForm").addEventListener('submit', async e => {
    e.preventDefault()

    const form = e.target
    const params = new URLSearchParams()
    new FormData(form).forEach((value, key)=> {
        params.append(key, value)
    })
    
    try {
        const res = await fetch('/exercises?' + params.toString())
        
        if(!res.ok) throw new Error (`HTTP ${res.status}`)
            
            const exercises = await res.json()
    
        // Set up list elements in existing ul tags
        const ul= document.getElementById('results')
        if(exercises.length === 0){
            ul.innerHTML = `<li>No exercises found</li>`
        }else{
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
        document.getElementById('results').innerHTML =`<li style="color: red">Failed to load exercises</li>`
    }
})


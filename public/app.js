// Fetch data and format data results as html
document.getElementById("filterForm").addEventListener('submit', async e => {
    // refers to the HTML document and seeks the ge the element that has an id of filterforms
    //  an event listener waits for an action to be carried which in this case is when the form is submitted
    // an asycnchronous function which is a funtion that gives a promise to the user to wait while the promise is pending, fulfilled or rejected. if fulfilled the function is returns something
    //  this function has e as its argument which stands for an event 
    e.preventDefault()
// the preventDefault is function is used to prevent the default behaviour of e which is the event the defaultbehavior is varided . an example is a page reloading after the submission of a form  
    const form = e.target
    //  the target here refers to the specific element that triggers the event which is the submit button and this target is assigned to the form variable
    const params = new URLSearchParams()
    // the urlsearchparams is an interface that provides methods for working with the query string of a URL which comes after ? this interface is assigned to the 
    new FormData(form).forEach((value, key)=> {
        //  the FormData object provides a way to constrct key value pairs from form fields and their values
        //  in this situation we run extract the key value pair from the form and run a loopappending the key value pair to the params 
        params.append(key, value)
    })
    
    try {
        const res = await fetch('/exercises?' + params.toString())
        // try catch block that uses the fetch AP! to send requests to the server 
        if(!res.ok) throw new Error (`HTTP ${res.status}`)
            // error handling
            const exercises = await res.json()
        // response in form of JSON assigned to the exercises variable
        // Set up list elements in existing ul tags
        const ul= document.getElementById('results')
        // assign the element with the identofer results to the variable u;
        if(exercises.length === 0){
            ul.innerHTML = `<li>No exercises found</li>`
            // handle edge case where there is no exercise 
        }else{
            ul.innerHTML = exercises.map(exercise => {
                // display the exercixe, create a link using the exercise name and the ecodeURI componetn with the id of the xercise as a link to open the details of the exercise 
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
       
// error handling
    } catch (error) {
        console.error(`Error fetching exercises`, error)
        document.getElementById('results').innerHTML =`<li style="color: red">Failed to load exercises</li>`
    }
})


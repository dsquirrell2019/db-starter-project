const handleSave = async (id) => {
    await fetch('/api/saved-exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
    })
  };
  
  
  const workoutView = (workout) => `
  
  <div class="col-12">
      <div class="card">
          <h5 class="card-header"> ${workout.exercise} <strong>(search match: ${workout.score})</strong></h5>
          <div class="card-body">
           <p class="card-text">${workout._id}</p>
            <ul class="list-group">
                 <li class="list-group-item">Weight: ${workout.weight}</li>
                 <li class="list-group-item">Reps: ${workout.reps}</li>
                 <li class="list-group-item">Sets: ${workout.sets}</li>
                 <li class="list-group-item">Difficulty: ${workout.difficulty}</li>
            </ul>
          </div>
          <a href="#" class="btn btn-primary" onclick="handleSave('${workout._id}')">Save</a>

        </div>
        
   </div>

  `;
  
  
  const handleSubmit = async () => {
      const searchVal = document.querySelector("#searchInput").value;
      try {
          const workoutDomRef = document.querySelector('#workoutItems');
          const ref = await fetch(`/api/search-exercises/?search=${searchVal}`);
          const searchResults = await ref.json();
          let workoutHtml = [];
          searchResults.forEach(workout => {
            workoutHtml.push(workoutView(workout));
          });
          workoutDomRef.innerHTML = workoutHtml.join(""); 
      } catch (e) {
          console.log(e);
          console.log('could not search api');
      }
  
  }
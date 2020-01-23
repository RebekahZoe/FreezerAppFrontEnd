"use strict";

function getFreezers(){
    axios.get('/FreezerApplication/getAllFreezers')
    .then((response)=>{
        showFreezers(response.data);
        console.log(response.data);
    }).catch((error)=>{
        console.error(error);
    })
}

const freezerList = document.getElementById("listOfFreezers");
function showFreezers(freezer){
freezerList.innerHTML="";
for (let f of freezer){
    const newFreezer = document.createElement("li");
    newFreezer.innerHTML = f.freezerName;

    freezerList.appendChild(newFreezer);
    newFreezer.addEventListener('click', () => redirect(f.freezerName,f.id));
}
}
function redirect(name,id){
    window.location.href = "\IndividualFreezer.html?name="+name+"&id="+id;
}

function createFreezer(){
    var hasNumber = /\d/;

    var format = /[!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;


    const freezer = document.getElementById("freezerNameAdd").value.toLowerCase().trim();
    if(freezer !== ""){
        if (hasNumber.test(freezer)){
            alert("Please enter a valid freezer name (No numbers)");
        } 
        else if (format.test(freezer)){
            alert("Please enter a valid freezer name (No special characters)");
        }
        else if (freezer.length < 6){
            alert("Please enter a valid freezer name of 6 characters or more");
        }
        else{
            console.log(freezer);

            axios.post('/FreezerApplication/createFreezer',{

                freezerName : freezer
            })
            .then(function (response) {
                console.log(response);
                getFreezers();
                location.reload();
              })
              .catch(function (error) {
                console.log(error);
              });
              getFreezers();
              
        }
    }
    else{
        alert("Please enter a valid freezer name");
    }

}



function deleteValidation(){
    const freezer = document.getElementById("freezerNameDelete").value.toLowerCase().trim();
    var hasNumber = /\d/;
    var format = /[!@#$%^£&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(freezer !== ""){
        console.log(freezer);
        if (hasNumber.test(freezer)){
            alert("Please enter a valid freezer name (No numbers)");
        } 
        else if (format.test(freezer)){
            alert("Please enter a valid freezer name (No special characters)");
        }
        else if (freezer.length < 6){
            alert("Please enter a valid freezer name of 6 characters or more");
        }
        else{
            console.log(freezer);
            if (confirm("Are you sure you want to delete this freezer?")){
                axios.delete("/FreezerApplication/deleteFreezerByName/"+freezer)
                .then((response)=>{
                    getFreezers();
                    console.log(response);
                    location.reload();
                    
                })
                .catch(function (error) {
                console.log(error);
                alert("Freezer name is not in the list");
                getFreezers();

                });
            }
    }

    }
    else{
        alert("Please enter a valid freezer name");
    }
}



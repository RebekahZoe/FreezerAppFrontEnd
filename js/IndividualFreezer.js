"use strict";
function getQueryVariable(variable)
{
       let query = window.location.search.substring(1);
       let vars = query.split("&");
       for (let i=0;i<vars.length;i++) {
               let pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function setTitle(){
    let title = document.getElementById("freezerName");
    let newTitle = document.createElement("h1");
    let titleText = getQueryVariable("name");
    newTitle.innerHTML = toTitleCase(decodeURI(titleText));
    title.appendChild(newTitle);

}
let fId = getQueryVariable("id");

function getItemsFromFreezer(){

   axios.get("/FreezerApplication/getItemsFromFreezer/"+fId)
   .then((response)=>{
        showItemsFromFreezer(response.data);
        console.log(response);
   })
   .catch((error)=>{
       console.error(error);
   })
}

const headerRow = document.getElementById("headerRow")
const itemList = document.getElementById("itemsInFreezer");
function showItemsFromFreezer(items){
    itemList.innerHTML = " ";
    headerRow.innerHTML =" ";
    let itemHeader = document.createElement("th");
    let quantityHeader = document.createElement("th");

    itemHeader.innerHTML = "Items";
    quantityHeader.innerHTML = "Quantity";

    headerRow.appendChild(itemHeader);
    headerRow.appendChild(quantityHeader);
    itemList.appendChild(headerRow);

    console.log(items);
for (let item of items){
    let newRow= document.createElement("tr");
    let newItem = document.createElement("td");
    let newQuantity = document.createElement("td");
    newItem.innerHTML = item.itemName;
    newQuantity.innerHTML = item.quantity;
    newRow.appendChild(newItem);
    newRow.appendChild(newQuantity);

    itemList.appendChild(newRow);
}
}

function createNewItem(){

    let item = document.getElementById("itemNameAdd").value.toLowerCase().trim();
    let  quantity = document.getElementById("quantityAdd").value.trim();
    if(item !== "" && quantity !==""){
        if (itemNameValidation(item) == " " && quantityValidation(quantity) == " "){
            axios.patch("/FreezerApplication/addItem/"+fId,{
                    itemName : item,
                    quantity : quantity
                }).then(()=>{
                    getItemsFromFreezer();
                    location.reload();
                })
        }
            else if (itemNameValidation(item) == " " && quantityValidation(quantity) !== " "){
                alert("Please enter "+quantityValidation(quantity));
            }
            else if (itemNameValidation(item) !== " " && quantityValidation(quantity) == " ") {
                alert(itemNameValidation(item));
            }
            else{
                alert(itemNameValidation(item)+" and "+ quantityValidation(quantity));
            }
        }
    else{
        alert("Please enter a valid item name and quantity");
    }


}
function itemNameValidation(item){
    let hasNumber = /\d/;

    let format = /[!@#$%£^*&()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (hasNumber.test(item)){
        return "Please enter a valid item name (No numbers)";
    }
    else if (format.test(item)){
        return "Please enter a valid item name (No special characters)";
    }
    else if (item.length < 3){
        return "Please enter a valid item name (must be at least 3 characters)";
    }
    else{
        return " ";
    }

}
function quantityValidation(quantity){
    let letters = /^[A-Za-z]+$/;
    let format = /[!@#$%&^*(£)_+\-=\[\]{};':"\\|,<>\/?]+/;
    let decimal =".";
    if (letters.test(quantity)){
        return "a valid quantity (no letters)"
    }
    else if (format.test(quantity)){
        return "a valid quantity (no special characters)"
    }
    else if (quantity === "0"){
        return "a valid quantity (must be greater than 0)"
    }
    else if (quantity.includes(decimal)){
        return "a valid quantity (must be a whole number)"
    }
    else{
        return " "
    }


}
function editItem(){

    let item = document.getElementById("itemNameEdit").value.toLowerCase().trim();
    let quantity = document.getElementById("quantityEdit").value.trim();
    
    if(item !== "" && quantity !==""){
        if (itemNameValidation(item) == " " && quantityValidation(quantity) == " "){
                axios.put("/FreezerApplication/updateItemByName/"+item+"/"+fId,{
                    itemName : item,
                    quantity : quantity
                }).then(()=>{
                    getItemsFromFreezer();
                    location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Item is not in this freezer");
                    location.reload();
                });
            }
    
            else if (itemNameValidation(item) == " " && quantityValidation(quantity) !== " "){
                alert("Please enter "+quantityValidation(quantity));
            }
            else if (itemNameValidation(item) !== " " && quantityValidation(quantity) == " ") {
                alert(itemNameValidation(item));
            }
            else{
                alert(itemNameValidation(item)+" and "+ quantityValidation(quantity));
            }
    }
    else{
        alert("Please enter a valid item name and quantity")
    } 

}

function deleteItem(){

    let item = document.getElementById("itemNameDelete").value.toLowerCase().trim();
    
    if(item !== ""){
        if(itemNameValidation(item)== " "){
            if (confirm("Are you sure you want to delete this item?")){
                axios.delete("/FreezerApplication/deleteItemFromFreezerByName/"+item+"/"+fId)               
                .then((response)=>{
                    console.log(response);
                    getItemsFromFreezer(); 
                    location.reload();
                    
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Item is not in this freezer");
                    location.reload();
                });
                
            }
            
        }
        else {
            alert(itemNameValidation(item));
        }   
        }
        
    
    else{
        alert("Please enter a valid item name");
    }
}



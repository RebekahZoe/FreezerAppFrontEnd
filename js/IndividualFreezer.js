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
       sortTable();
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
    //if (hasNumber.test(item)){
     //      return "Please enter a valid item name (No Numbers);
   // }
      if (format.test(item)){
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
    //if (letters.test(quantity)){
      //  return "a valid quantity (no letters)"
    //}
    if (format.test(quantity)){
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
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("itemsInFreezer");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = document.getElementsByTagName("tr");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("itemsInFreezer");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}



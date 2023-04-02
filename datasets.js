
let data = ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4' ];
 
let list = document.getElementById("datasets_list");
 
data.forEach((item)=>{
  let li = document.createElement("li");
  var button = document.createElement("button");
  button.innerText = item;
  button.onclick = '';
  li.appendChild(button);
  list.appendChild(li);
})
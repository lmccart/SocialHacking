// add html overlay elts to page
// PEND: change this to load html file
var newdiv = document.createElement('div'); 
newdiv.setAttribute('id','sabotage');
var wordsdiv = document.createElement("div");
wordsdiv.setAttribute('id', 'words');
newdiv.appendChild(wordsdiv);
document.body.appendChild(newdiv);


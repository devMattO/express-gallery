//function cogFunc (){
window.onload = function(){
var cog_options = document.getElementById('cog_options');
cog_options.addEventListener('click', showOptions);
//}
  function showOptions(event){
    var showBtns = document.getElementsByClassName('option_buttons');
    if(showBtns[0].classList.contains('show') === false){
         return showBtns[0].classList.add('show');
    }else{
         return showBtns[0].classList.remove('show');
    }
  }
};
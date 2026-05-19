function sterg(i, j){
    re.chosen_current(i, j);

}

function set_w_lar(){
    re.set_w_lar(document.getElementById("w_lar").value);
}


async function playAudio() {
window.my_mute = false;
  var audio = document.getElementById("play");
//  audio.type = 'audio/wav';
  await audio.play();
  audio.loop = true;
  try {
//    await audio.play();
//    document.querySelector('#kill_call_btn').addEventListener('click', function(){
//        audio.pause();
//    });
//    document.querySelector('#global_menu_d').addEventListener('click', function(){
//        audio.pause();
//    });

    console.log('Playing...');

    return audio;
  } catch (err) {
    console.log('Failed to play...' + err);
  }

}
function sterg(i, j){
    re.chosen_current(i, j);

}

function set_w_ar(){
    re.az.set_w_ar(document.getElementById("w_ar").value);
}


async function playAudio() {
  window.my_mute = false;
  var audio = document.getElementById("play");
  await audio.play();
  audio.loop = true;
  try {
    console.log('Playing...');
    return audio;
  } catch (err) {
    console.log('Failed to play...' + err);
  }

}
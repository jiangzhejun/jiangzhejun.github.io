function act(dest) {
  dest.style.display = dest.style.display == "none" ? "" : "none";
}

window.onload = function() {
  act($0);
}
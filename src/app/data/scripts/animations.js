//CSS & HTML stuff
window.animatedElements = document.querySelectorAll('.animated')
window.addEventListener('resize', windowResized)
window.addEventListener('scroll', windowScrolled)
windowResized()

function windowResized() {
  window.windowHeight = window.innerHeight
  windowScrolled()
}
function windowScrolled() {
  for (var i = 0; i < animatedElements.length; i++) {
    var positionFromTop = (animatedElements[i].getBoundingClientRect().top + animatedElements[i].getBoundingClientRect().bottom) / 2
    if (positionFromTop - windowHeight <= 0) {
      animatedElements[i].classList.add('revealedAnimation')
    }
  }
}
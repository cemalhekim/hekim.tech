function animate() {
  const animateElements = document.querySelectorAll('.animate')

  animateElements.forEach((element, index) => {
    // data-delay lets a page schedule its own timing (e.g. two columns in parallel)
    const delay = element.dataset.delay !== undefined ? Number(element.dataset.delay) : index * 150
    setTimeout(() => {
      element.classList.add('show')
    }, delay)
  });
}

document.addEventListener("DOMContentLoaded", animate)
document.addEventListener("astro:after-swap", animate)
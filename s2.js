/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

/*--------------------
Constants
--------------------*/
const speedWheel = 0.2 / $items.length
const speedDrag = -1 / $items.length

/*--------------------
Vars
--------------------*/
let progress = 100
let startX = 0
let active = 0
let isDown = false



const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index]
    item.style.setProperty('--zIndex', zIndex)
    item.style.setProperty('--active', (index-active)/$items.length)
}

const displayItemsT = (item, index, active, t, z) => {
    setTimeout(() => {
        const zIndex = getZindex([...$items], active)[index]
        item.style.setProperty('--zIndex', z)
        item.style.setProperty('--active', (index-active)/$items.length)
    }, t);
}

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100))
    active = Math.floor(progress/100*($items.length-1))

    $items.forEach((item, index) => displayItems(item, index, active))
}


/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
    item.addEventListener('click', () => {
        if (active === i) {

            let modal = document.getElementById(active);
            modal.style.display = "block";
            let span = modal.getElementsByClassName("close")[0];
            span.onclick = () => { modal.style.display = "none" }

            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }

        }
        progress = (i/$items.length) * 100 + (100 / $items.length)
        animate()
    })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
    const wheelProgress = e.deltaY * speedWheel
    progress = progress + wheelProgress
    animate()
}

const handleMouseMove = (e) => {
    if (e.type === 'mousemove') {
        $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        })
    }
    if (!isDown) return
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const mouseProgress = (x - startX) * speedDrag
    progress = progress + mouseProgress
    startX = x
    animate()
}

const handleMouseDown = e => {
    isDown = true
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
    isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)

//onload
setTimeout(() => {
    progress = 100
    active = $items.length - 1;

    let timeout = 200;
    let len = $items.length;

    for (let i = len - 1; i >= 0; --i) {
        if (i === len - 1) continue;
        displayItemsT($items[i], i, active, (len - i) * timeout, len - 1);
    }
    setTimeout(() => {
        progress = (100 / $items.length) / 2; // start on 1
        animate();
    }, timeout * len + 1000)

}, 2000);

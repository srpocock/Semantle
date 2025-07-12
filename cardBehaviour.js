"use strict";
const cardRegion = document.querySelector('.card-region');
const card = document.querySelector('.card');
cardRegion === null || cardRegion === void 0 ? void 0 : cardRegion.addEventListener('mousemove', function (event) {
    const rect = cardRegion.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2));
    const y = event.clientY - (rect.top + rect.height / 2);
    const z = 400;
    const dist = Math.sqrt(x * x + y * y);
    const planeAngle = Math.atan2(-y, x);
    const cardAngle = Math.atan2(dist, z);
    console.log(`planeAngle: ${planeAngle}, dist: ${dist}, cardAngle: ${cardAngle}`);
    if (card) {
        card.style.transform = `rotate3d(${Math.sin(planeAngle)}, ${Math.cos(planeAngle)}, 0, ${cardAngle}rad) translateZ(0px)`;
    }
});
cardRegion === null || cardRegion === void 0 ? void 0 : cardRegion.addEventListener('mouseleave', function () {
    if (card) {
        card.style.transform = 'rotate3d(0, 0, 0, 0rad) translateZ(-35px)';
    }
});

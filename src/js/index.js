import '../sass/index.scss';
//import 'leaflet/dist/leaflet.css';

import tableController from './controllers/tableController';
import countryController from './controllers/countryController';
import graphController from './controllers/graphController';
import mapController from './controllers/mapController';

tableController.init();
countryController.init();
graphController.init();
mapController.init();

document.querySelectorAll(".fullscreen-btn").forEach((fullscreenBtn) => {
    fullscreenBtn.addEventListener("click", function() {
        this.closest(".card-panel").classList.toggle("fullscreen-mode");
        window.scrollTo(0, 0);
        document.body.classList.toggle('body-fullscreen');
        if (!this.classList.contains('close-fullscreen')) {
            this.classList.add('close-fullscreen');
            this.innerHTML = `<i class="material-icons">close_fullscreen</i>`;
        } else {
            this.classList.remove('close-fullscreen');
            this.innerHTML = `<i class="material-icons">open_in_full</i>`;
        }
    });
});
import '../sass/index.scss';
//import './core/virtual-keyboard/script';

import tableController from './controllers/tableController';
import countryController from './controllers/countryController';
import graphController from './controllers/graphController';
import mapController from './controllers/mapController';

tableController.init();
countryController.init();
graphController.init();
mapController.init();


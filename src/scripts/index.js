import '../styles/index.scss';
import '../scripts/controllers/ProductController';
import '../scripts/views/ProductRenderer';
import {ProductController} from "./controllers/ProductController";
import {EventObserver} from "./EventObserver";


export let App = new ProductController();
export let Observer = new EventObserver();



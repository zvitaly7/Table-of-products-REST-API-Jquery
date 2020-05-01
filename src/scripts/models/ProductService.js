
import {HOST} from "../settings";

export class ProductService {
    constructor(render) {
        this.render = render;
        this.productlist = null;
    }

    getData() {
        const Url = `${HOST}/api/v1/products`;
        fetch(Url).then(response => response.json()).then(
            data => {
                this.productlist = data;
                this.render.RenderList(this.productlist.Data);
            });
    }

    deleteProduct(id) {
        const Url = `${HOST}/api/v1/products/delete/`;
        fetch(Url + id, {
            method: 'DELETE',
        }).then(response => response.ok).then(
            data => {
                this.render.HideWindow(this.render.deleteWindow);
                this.getData();
            });
    }

    addProduct(product) {
        const Url = `${HOST}/api/v1/products/add`;
        fetch(Url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(product)
        }).then(response => response.ok).then(
            data => {
                this.render.HideWindow(this.render.addWindow);
                this.getData();
            });

    }

    updateProduct(product, id) {
        const Url = `${HOST}/api/v1/products/update/`;
        console.log(id);
        fetch(Url + id, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(product)
        }).then(response => response.ok).then(
            data => {
                this.render.HideWindow(this.render.addWindow);
                this.getData();
            });
    }

}




import {ProductController} from "../controllers/ProductController";

export class ProductRenderer {
    constructor(){
        this.addWindow = $('#window-product-add');
        this.deleteWindow = $('#window-product-delete');
        this.overlay = $('#overlay');
    }

    prepareRow(name, price, count, rowNum, id) {
        return `
        <tr data-id="${rowNum}" class="table-data">
            <td>${rowNum}</td>
            <td>
                <a href="#" class="product-name">${name}</a>
                 <span class="label label-info product-count">${count}</span>
            </td>
            <td>${price}</td>
            <td>
                <button data-id="${id}" class="btn btn-warning edit-product">Edit</button>
                 <button data-id="${id}" class="btn btn-danger delete-product">Delete</button>
            </td>
         </tr>
     `;
    }

    RenderList(data) {
        $('#tbody-table').empty();
        data.forEach((product, rowNum) => {
            $(this.prepareRow(product.name, product.price, product.count, rowNum, product.id)).appendTo('#tbody-table');
        });
    }

    RenderDeleteWindow() {
        let winProductDelete = $('#window-product-delete');
        this.overlay.fadeIn(400);
        this.deleteWindow.fadeIn();
        this.deleteWindow.animate({top: '50%'}, 200);
    }

    RenderAddWindow(){
        this.overlay.fadeIn(400);
        this.addWindow.fadeIn();
        this.addWindow.animate({ top: '30%' }, 200);
        this.HideBlock($('#block-country'));
        this.HideBlock($('#block-city'));
        $('#delivery-product').change(this.changeSelectHandler.bind(this));
        $('#count-product').on('change keyup input click', this.pressHandler);
        $('#price-product').focusout(this.formatPriceHandler);
        $('#price-product').focusin(this.formatNumberHandler);



    }


    HideWindow(window) {
        window.animate({top: '30%'}, 200);
        this.overlay.fadeOut(400);
        window.fadeOut();
    }

    RenderSort($hideElem, $showElem, fieldSort, productsList, order) {
        $hideElem.next().css('opacity', '0');
        $showElem.next().css('opacity', '1');
        if (order === 1) {
            $showElem.next().removeClass('fa-caret-square-o-down');
            $showElem.next().addClass('fa-caret-square-o-up');

        } else {
            $showElem.next().removeClass('fa-caret-square-o-up');
            $showElem.next().addClass('fa-caret-square-o-down');
        }
        this.RenderList(productsList);
    }

    HideBlock($elem){
        $elem.css('display', 'none');
    }
    ShowBlock($elem){
        $elem.css('display', 'block');
    }
    HideError($field){
        $field.css('border-color', '#ccc');
        $field.next().css('display', 'none');
    }
    ShowError($field, text){
        $field.css('border-color', '#eb7e87');
        $field.next().html(text);
        $field.next().css('color', 'red');
        $field.next().css('display', 'inline-block');
    }
    changeSelectHandler(){
        let selectedCheckbox = $('#delivery-product :selected');
        if (selectedCheckbox.text() === 'Country') {
            this.ShowBlock($('#block-country'));
            this.HideBlock($('#block-city'));
        } else if (selectedCheckbox.text() === 'City') {
            this.HideBlock($('#block-country'));
            this.ShowBlock($('#block-city'));
        } else {
            this.HideBlock($('#block-country'));
            this.HideBlock($('#block-city'));
        }
    }

    ShowErrors(messages){
        let inputs = {
            name: $('#name-product'),
            email: $('#email-supplier'),
            count: $('#count-product'),
            price: $('#price-product')
        };
        // hide errors
        for (var keyInputs in inputs) {
            this.HideError($(inputs[keyInputs]));
        }
        for (let i = 0; i < messages.length; i++) {
            let msgText = messages[i];
            // parse name field
            let nameField = msgText.slice(msgText.indexOf('*') + 1, msgText.lastIndexOf('*'));
            // parse text error
            let textError = msgText.slice(msgText.lastIndexOf('*') + 1);
            for (keyInputs in inputs) {
                if (keyInputs === nameField) {
                    nameField = inputs[keyInputs];
                    this.ShowError($(nameField), textError);
                }
            }
            // focus in error field
            if (i === 0) {
                $(nameField).focus();
            }
        }

    }

    pressHandler(){
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    }
    formatNumberHandler() {
        if (this.value) {
            this.value = this.value.slice(1);
            this.value = parseFloat(this.value.replace(/,/g, '')).toFixed(2);
        }
    }
    formatPriceHandler() {
        if (this.value) {
            let currency = '$';
            this.value = currency + parseFloat(this.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

        }
    }


}


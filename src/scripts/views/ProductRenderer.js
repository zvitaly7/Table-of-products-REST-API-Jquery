
import {ShowErrors} from "./ShowErrors";


export class ProductRenderer {
    constructor() {
        this.addWindow = $('#window-product-add');
        this.deleteWindow = $('#window-product-delete');
        this.overlay = $('#overlay');
        this.errorRender = new ShowErrors();
    }

    prepareRow(name, price, count, rowNum, id) {
        return `
        <tr data-id="${id}" class="table-data">
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
        this.overlay.fadeIn(400);
        this.deleteWindow.fadeIn();
        this.deleteWindow.animate({top: '50%'}, 200);
    }

    RenderAddWindow() {
        this.cleanFields();
        this.overlay.fadeIn(400);
        this.addWindow.fadeIn();
        this.addWindow.animate({top: '30%'}, 200);
        this.HideBlock($('#block-country'));
        this.HideBlock($('#block-city'));
        this.HideBlock($('#btnEditProduct'));
        this.ShowBlock($('#btnAddProduct'));
        $('#delivery-product').change(this.changeSelectHandler.bind(this));

    }

    RenderEditWindow(productData) {
        this.overlay.fadeIn(400);
        this.addWindow.fadeIn();
        this.addWindow.animate({top: '30%'}, 200);
        this.HideBlock($('#btnAddProduct'));
        this.ShowBlock($('#btnEditProduct'));
        $('#delivery-product').change(this.changeSelectHandler.bind(this));
        $('#name-product').val(productData.name);
        $('#email-supplier').val(productData.email);
        $('#count-product').val(productData.count);
        $('#price-product').val(productData.price);
    }

    cleanFields() {
        $('.form-add-product')[0].reset();
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

    HideBlock($elem) {
        $elem.css('display', 'none');
    }

    ShowBlock($elem) {
        $elem.css('display', 'block');
    }

    changeSelectHandler() {
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
    showSelect(product) {
        if (product.delivery.city.length != null) {
            $("#delivery-product [value='city']").attr("selected", "selected");
            let city = product.delivery.city;
            for (let i = 0; i < city.length; i++) {
                $("#" + city[i].toUpperCase()).attr('checked', 'checked');
            }
            // Show block
            this.HideBlock($('#block-country'));
            this.ShowBlock($('#block-city'));

        } else if (product.delivery.country.length) {
            // show value in select
            $("#delivery-product [value='country']").attr("selected", "selected"); // add in view
            // show checked value
            var country = (product.delivery.country).toLowerCase();
            $("input[name=" + country + "]").prop('checked', true);
            // Show block
            this.ShowBlock($('#block-country'));
            this.HideBlock($('#block-city'));
        } else {
            $("#delivery-product [value='empty']").attr("selected", "selected"); // add in view
            // Hide blocks
            this.HideBlock($('#block-country'));
            this.HideBlock($('#block-city'));
        }
    }


}


import axios from 'axios';

// const allCars = document.querySelector('.car');
const carImage = document.querySelector('.car-image') as HTMLImageElement;
const carName = document.querySelector('.car-name');
const carDesc = document.querySelector('.car-desc');

axios
    // .get('http://localhost:3004/cars')
    .get('http://localhost:3004/cars', {
        responseType: 'json',
    })
    .then(function (response) {
        // id amount
        let idCount = countId(response);

        for (let i = 0; i < idCount; i++) {
            let id = response.data[i].id;
            let img = response.data[i].image;
            let name = response.data[i].name;
            let desc = response.data[i].desc;

            let card = document.createElement('card');
            card.setAttribute('id', id);
            card.innerHTML = `<div class="car column">
                <img class="car-image" src="${img}" alt="car" />
                <div class="car-name">${name}</div>
                <div class="car-desc">${desc}</div>
                <button type="button" class="editButton${id} confirm-add-car btn btn-outline-secondary">Edit</button>
                <button type="button" class="deleteButton${id} confirm-add-car btn btn-outline-secondary">Delete</button>
            </div>`;
            document.getElementsByClassName('all-cars')[0].appendChild(card);
            // -----------------------------------
            // HANDLE BUTTONS
            // -----------------------------------
            const deletetCarButton = document.querySelector(
                `.deleteButton${id}`,
            );
            deletetCarButton.addEventListener('click', () => {
                async function deleteShit(id: number) {
                    await axios.delete(`http://localhost:3004/cars/${id}`);
                    console.log('deleted');
                    window.location.reload();
                }
                deleteShit(id);
            });
        }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });

// -----------------------------------
// ADD CAR
// -----------------------------------
const addCar = document.querySelector('.addButton');
addCar.addEventListener('click', () => {
    let showAddForm = document.querySelector('.add-form');
    showAddForm.classList.remove('hide');
});

// CANCEL ADD BUTTON
const cancelCarConfirm = document.querySelector('.cancel-add-car');
cancelCarConfirm.addEventListener('click', () => {
    let hideAddForm = document.querySelector('.add-form');
    hideAddForm.classList.add('hide');
});

const addCarConfirm = document.querySelector('.confirm-add-car');
addCarConfirm.addEventListener('click', () => {
    axios
        // .get('http://localhost:3004/cars')
        .get('http://localhost:3004/cars', {
            responseType: 'json',
        })
        .then(function (response) {
            let id: any;
            let idArr = idArray(response);
            for (let i = 0; i < 100; i++) {
                if (idArr.includes(i)) {
                    continue;
                } else {
                    id = i;
                    break;
                }
            }

            let name = (<any>document.querySelector('.add-car-name')).value;
            let img = (<any>document.querySelector('.add-card-img')).value;
            let desc = (<any>document.querySelector('.add-car-desc')).value;

            if (name.length > 0 && img.includes(`http`) && desc.length > 0) {
                axios.post(`http://localhost:3004/cars/`, {
                    id: `${id}`,
                    name: `${name}`,
                    image: `${img}`,
                    desc: `${desc}`,
                });
            }

            let card = document.createElement('card');
            card.setAttribute('id', id);
            card.innerHTML = `<div class="car column">
                <img class="car-image " src="${img}" alt="car" />
                <div class="car-name">${name}</div>
                <div class="car-desc">${desc}</div>
                <button type="button" class="editButton${id} confirm-add-car btn btn-outline-secondary">Edit</button>
                <button type="button" class="deleteButton${id} confirm-add-car btn btn-outline-secondary">Delete</button>
            </div>`;

            // document.getElementsByClassName('all-cars')[0].appendChild(card);

            async function makeCard(card: any) {
                document
                    .getElementsByClassName('all-cars')[0]
                    .appendChild(card);
                window.location.reload();
            }
            makeCard(card);

            // -----------------------------------
            // HANDLE BUTTONS
            // -----------------------------------
            const deletetCarButton = document.querySelector(
                `.deleteButton${id}`,
            );
            deletetCarButton.addEventListener('click', () => {
                async function deleteCar(id: number) {
                    await axios.delete(`http://localhost:3004/cars/${id}`);
                    console.log('deleted');
                    window.location.reload();
                }
                deleteCar(id);
            });
        });
});

// Id count from JSON
const countId = (data: any) => {
    let idCount = 0;
    data.data.map(function (val: any) {
        if (val.id) {
            idCount++;
        }
    });
    return idCount;
};

// Id Array
const idArray = (data: any) => {
    let idArray: any = [];
    data.data.map(function (val: any) {
        if (val.id) {
            idArray.push(Number(val.id));
        }
    });
    return idArray;
};

import axios from 'axios';
const url = 'http://localhost:3004/cars';

interface Car {
    id: string;
    name: string;
    image: string;
    desc: string;
}

// -----------------------------------
// ADD CAR
// -----------------------------------
const addCarButton = document.querySelector('.add-car');
addCarButton.addEventListener('click', () => {
    let showAddForm = document.querySelector('.add-car-form');
    showAddForm.classList.remove('hide');
});

// -----------------------------------
// CANCEL ADD FORM BUTTON
// -----------------------------------
const cancelCarConfirm = document.querySelector('.cancel-add-car');
cancelCarConfirm.addEventListener('click', () => {
    let hideAddForm = document.querySelector('.add-car-form');
    hideAddForm.classList.add('hide');
});

// -----------------------------------
// CANCEL EDIT FORM BUTTON
// -----------------------------------
const cancelEditForm = document.querySelector('.cancel-edit-car');
cancelEditForm.addEventListener('click', () => {
    let hideAddForm = document.querySelector('.edit-car-form');
    hideAddForm.classList.add('hide');
});

// Make card with data
function makeCard(data: Car[], i: number) {
    let id = data[i].id;
    let name = data[i].name;
    let image = data[i].image;
    let desc = data[i].desc;

    let card = document.createElement('card');
    card.innerHTML = `
    <div class="car" id="${id}">
        <img class="car-image" src="${image}" alt="${name}" />
        <div class="name">${name}</div>
        <div class="desc">${desc}</div>
        <button type="button" id="editButton${id}" class="btn btn-outline-secondary">Edit</button>
        <button type="button" id="deleteButton${id}" class="btn btn-outline-secondary">Delete</button>
    </div>
    `;
    document.getElementsByClassName('all-cars')[0].appendChild(card);
}

// JSON read ALL
async function readAllJson() {
    let response = await axios.get(url);
    let data = response.data;
    // console.log(data[0].name);
    return data;
}

// Create all cars
async function outputCars() {
    let data = await readAllJson();
    let idCount = Object.keys(data).length;
    for (let i = 0; i < idCount; i++) {
        makeCard(data, i);
    }
    activateButtons();
}
outputCars();

async function activateButtons() {
    const buttons = document.getElementsByTagName('button');
    const result = document.getElementById('result');

    const buttonPressed = (e: any) => {
        let button = e.target.id;
        if (button.includes('delete')) {
            deleteItem(button);
        }
        if (button.includes('edit')) {
            let hideAddForm = document.querySelector('.edit-car-form');
            hideAddForm.classList.remove('hide');
            editItem(button);
        }
    };

    for (let button of buttons) {
        button.addEventListener('click', buttonPressed);
    }
}

async function deleteItem(button: string) {
    let id = Number(button.replace('deleteButton', ''));
    await axios.delete(`${url}/${id}`);
    window.location.reload();
}

// Add car
async function addCar() {
    let data = await readAllJson();
    let id = idArray(data);
    let name = (
        document.querySelector('.add-car-name') as HTMLInputElement | null
    ).value;
    let image = (
        document.querySelector('.add-card-image') as HTMLInputElement | null
    ).value;
    let desc = (
        document.querySelector('.add-car-desc') as HTMLInputElement | null
    ).value;
    console.log(id, name, image, desc);
    if (name.length > 0 && image.includes(`http`) && desc.length > 0) {
        await axios
            .post(`http://localhost:3004/cars/`, {
                id: `${id}`,
                name: `${name}`,
                image: `${image}`,
                desc: `${desc}`,
            })
            .then(function (response) {
                window.location.reload();
            });
    } else {
        document.getElementById('add-error').innerHTML =
            'Incorrect input! Try again.';
    }
}

const addCarConfirm = document.querySelector('.confirm-add-car');
addCarConfirm.addEventListener('click', () => {
    addCar();
});

// Return free JSON ID
const idArray = (data: any) => {
    let idArray: number[] = [];
    let id: number;
    data.map(function (val: any) {
        if (val.id) {
            idArray.push(Number(val.id));
        }
    });
    for (let i = 0; i < 100; i++) {
        if (idArray.includes(i)) {
            continue;
        } else {
            id = i;
            return id;
        }
    }
};

// Edit item
async function editItem(button: string) {
    let data = await readAllJson();
    let id = Number(button.replace('editButton', ''));
    let name = data[id].name;
    let image = data[id].image;
    let desc = data[id].desc;
    (document.querySelector('.edit-car-name') as HTMLInputElement).value = name;
    (document.querySelector('.edit-card-image') as HTMLInputElement).value =
        image;
    (document.querySelector('.edit-car-desc') as HTMLInputElement).value = desc;

    const EditCarConfirm = document.querySelector('.confirm-edit-car');
    EditCarConfirm.addEventListener('click', () => {
        let setName = (
            document.querySelector('.edit-car-name') as HTMLInputElement | null
        ).value;
        let setImage = (<any>document.querySelector('.edit-card-image')).value;
        let setDesc = (<any>document.querySelector('.edit-car-desc')).value;
        editCar(id, setName, setImage, setDesc);
    });
}

async function editCar(id: number, name: string, image: string, desc: string) {
    if (name.length > 0 && image.includes(`http`) && desc.length > 0) {
        await axios
            .patch(`http://localhost:3004/cars/${id}`, {
                id: `${id}`,
                name: `${name}`,
                image: `${image}`,
                desc: `${desc}`,
            })
            .then(function (response) {
                window.location.reload();
            });
    } else {
        document.getElementById('edit-error').innerHTML =
            'Incorect input! Try again.';
    }
}

const url = 'http://localhost:3001/users';

let users = [];
let inputSearch = null;
let buttonSearch = null;
let spinnerLoading = null;

const MINIMUM_LENGTH_SEARCH = 1;

const formatter = Intl.NumberFormat('pt-BR');

async function start() {
  await fetchUsers();
  mapIds();
  addEvents();
  enableControls();

  showNoUsers();
  showNoStatistics();
}

async function fetchUsers() {
  const res = await fetch(url);
  const json = await res.json();

  users = json
    .map(({ login, name, picture, dob, gender }) => {
      return {
        id: login.uuid,
        name: `${name.first} ${name.last}`,
        filterName: `${name.first} ${name.last}`.toLowerCase(),
        picture: picture.large,
        age: dob.age,
        gender: gender,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function mapIds() {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('#buttonSearch');
  spinnerLoading = document.querySelector('#spinnerLoading');
  divUsers = document.querySelector('#divUsers');
  divStatistics = document.querySelector('#divStatistics');
}

function addEvents() {
  inputSearch.addEventListener('keyup', handleInputChange);
  buttonSearch.addEventListener('click', () =>
    filterUsers(inputSearch.value.trim())
  );
}

function enableControls() {
  setTimeout(() => {
    inputSearch.disabled = false;
    inputSearch.focus();

    spinnerLoading.classList.add('hidden');
  }, 1000);
}

function handleInputChange(event) {
  const searchText = event.target.value.trim();
  const length = searchText.length;

  buttonSearch.disabled = length < MINIMUM_LENGTH_SEARCH;

  if (event.key != 'Enter') {
    return;
  }

  if (length < MINIMUM_LENGTH_SEARCH) {
    return;
  }

  filterUsers(searchText);
}

function filterUsers(searchText) {
  const lowerCaseSearchText = searchText.toLowerCase();

  const filteredUsers = users.filter((user) => {
    return user.filterName.includes(lowerCaseSearchText);
  });

  handleFilteredUsers(filteredUsers);
}

function handleFilteredUsers(users) {
  if (users.length === 0) {
    showNoUsers();
    showNoStatistics();
  }

  showUsers(users);
  showStatistics(users);
}

function showNoUsers() {
  divUsers.innerHTML = `<h2>No users</h2>`;
}

function showNoStatistics() {
  divStatistics.innerHTML = `<h2>No data</h2>`;
}

function showUsers(users) {
  const h2 = document.createElement('h2');
  h2.textContent = users.length + ' user(s) found';

  const ul = document.createElement('ul');

  users.map(({ name, picture, age }) => {
    const li = document.createElement('li');
    li.classList.add('flex-row');

    const img = `<img class='avatar' src=${picture} alt=${name} />`;
    const span = `<span>${name}, ${age} years old</span>`;

    li.innerHTML = `${img} ${span}`;
    ul.appendChild(li);
  });

  divUsers.innerHTML = '';
  divUsers.appendChild(h2);
  divUsers.appendChild(ul);
}

function showStatistics(users) {
  const countMale = users.filter((user) => user.gender === 'male').length;
  const countFemale = users.filter((user) => user.gender === 'female').length;
  const sumAges = users.reduce((acc, curr) => acc + curr.age, 0);
  const averageAges = (sumAges / users.length || 0)
    .toFixed(2)
    .replace('.', ',');

  divStatistics.innerHTML = `
      <h2>Statistics</h2>

      <ul>
        <li>Gender - Male: <strong>${countMale}</strong></li>
        <li>Gender - Feale: <strong>${countFemale}</strong></li>
        <li>Ages Sum: <strong>${sumAges}</strong></li>
        <li>Ages Average: <strong>${averageAges}</strong></li>
      </ul>
    `;
}

function formatValue(value) {
  return formatter.format(value);
}

start();

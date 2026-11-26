const destinations = [
  {country:'Vietnam',city:'Hanoi',base:56},
  {country:'Vietnam',city:'Ho Chi Minh City',base:63},
  {country:'Thailand',city:'Bangkok',base:72},
  {country:'Thailand',city:'Chiang Mai',base:49},
  {country:'Japan',city:'Tokyo',base:112},
  {country:'Japan',city:'Osaka',base:96},
  {country:'South Korea',city:'Seoul',base:91},
  {country:'South Korea',city:'Busan',base:78}
];
const hotelStyles = [
  {name:'Garden Hotel',priceOffset:0,features:['Private room lock','Well-lit entrance','Late check-in contact'],image:'sample-hotel-1.png'},
  {name:'Bloom Boutique Hotel',priceOffset:22,features:['Private room lock','Controlled entry','24-hour reception'],image:'sample-hotel-2.png'},
  {name:'Sora City Hotel',priceOffset:38,features:['Private room lock','Controlled entry','Well-lit entrance'],image:'sample-hotel-3.png'}
];
const stays = destinations.flatMap(destination => hotelStyles.map((hotel,index) => ({
  id:`${destination.city.toLowerCase().replace(/[^a-z]+/g,'-')}-${index + 1}`,
  name:`${hotel.name} ${destination.city}`,
  country:destination.country,city:destination.city,type:'Hotel',
  price:destination.base + hotel.priceOffset,guests:4,
  features:hotel.features,image:hotel.image
})));
const byId = id => document.getElementById(id);
const country = byId('country'), city = byId('city'), checkIn = byId('check-in'), checkOut = byId('check-out');
const searchMessage = byId('search-message'), listingGrid = byId('listing-grid');
const bookingDialog = byId('booking-dialog');
let selectedStay = null;
const today = new Date().toLocaleDateString('en-CA');
checkIn.min = today;
checkOut.min = today;
for (const name of [...new Set(stays.map(stay => stay.country))].sort()) country.add(new Option(name,name));
country.addEventListener('change', () => {
  city.replaceChildren(new Option('Select city',''));
  for (const name of [...new Set(stays.filter(stay => stay.country === country.value).map(stay => stay.city))].sort()) city.add(new Option(name,name));
  city.disabled = !country.value;
  listingGrid.replaceChildren();
});
checkIn.addEventListener('change', () => {
  checkOut.min = checkIn.value || today;
  if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = '';
});
function nights() { return Math.round((new Date(`${checkOut.value}T12:00:00`) - new Date(`${checkIn.value}T12:00:00`)) / 86400000); }
function currency(value) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value); }
function search() {
  if (!byId('search-form').reportValidity()) return;
  if (nights() < 1) { searchMessage.textContent = 'Check-out must be after check-in.'; checkOut.focus(); return; }
  const guestCount = Number(byId('guests').value);
  const results = stays.filter(stay => stay.country === country.value && stay.city === city.value && stay.guests >= guestCount);
  listingGrid.replaceChildren();
  searchMessage.textContent = `${results.length} sample ${results.length === 1 ? 'stay' : 'stays'} in ${city.value} · ${nights()} ${nights() === 1 ? 'night' : 'nights'}`;
  for (const stay of results) {
    const card = document.createElement('article'); card.className = 'listing-card';
    const art = document.createElement('div'); art.className = 'listing-art';
    const photo = document.createElement('img'); photo.src = stay.image; photo.alt = `Illustrative room photo for sample listing ${stay.name}`; photo.loading = 'lazy';
    const photoLabel = document.createElement('span'); photoLabel.textContent = 'Sample hotel · Illustrative photo';
    art.append(photo,photoLabel);
    const body = document.createElement('div'); body.className = 'listing-body';
    const title = document.createElement('h3'); title.textContent = stay.name;
    const details = document.createElement('p'); details.textContent = `${stay.city}, ${stay.country} · up to ${stay.guests} ${stay.guests === 1 ? 'guest' : 'guests'}`;
    const tags = document.createElement('ul'); tags.className = 'listing-features';
    for (const feature of stay.features) { const li = document.createElement('li'); li.textContent = feature; tags.append(li); }
    const price = document.createElement('p'); price.className = 'listing-price'; price.textContent = `${currency(stay.price)} / night · ${currency(stay.price * nights())} total estimate`;
    const button = document.createElement('button'); button.className = 'button button-primary'; button.type = 'button'; button.textContent = 'Choose this stay';
    button.addEventListener('click', () => { selectedStay = stay; byId('request-summary').textContent = `${stay.name} · ${checkIn.value} to ${checkOut.value} · ${byId('guests').value} guest(s) · ${currency(stay.price * nights())} estimated`; bookingDialog.showModal(); });
    body.append(title,details,tags,price,button); card.append(art,body); listingGrid.append(card);
  }
}
byId('search-form').addEventListener('submit', event => { event.preventDefault(); search(); });
byId('booking-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', event => { if (event.target === bookingDialog) bookingDialog.close(); });
const storageKey = 'herstay-sample-requests-v1';
function readRequests() { try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
function renderRequests() {
  const list = byId('requests-list'); list.replaceChildren();
  const requests = readRequests();
  if (!requests.length) { const empty = document.createElement('p'); empty.textContent = 'No saved requests yet.'; list.append(empty); return; }
  for (const request of requests) {
    const item = document.createElement('article'); item.className = 'saved-request';
    const main = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = `${request.stayName} · ${request.code}`;
    const meta = document.createElement('p'); meta.textContent = `${request.city}, ${request.country} · ${request.checkIn} to ${request.checkOut} · ${request.guests} guest(s) · ${currency(request.total)} estimated`;
    const note = document.createElement('small'); note.textContent = 'Saved locally · Not confirmed by a hotel';
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Remove request'; cancel.addEventListener('click', () => { localStorage.setItem(storageKey,JSON.stringify(readRequests().filter(entry => entry.code !== request.code))); renderRequests(); });
    main.append(title,meta,note); item.append(main,cancel); list.append(item);
  }
}
byId('request-form').addEventListener('submit', event => {
  event.preventDefault(); if (!selectedStay || !event.currentTarget.reportValidity()) return;
  const request = {code:`HS-${crypto.randomUUID().slice(0,8).toUpperCase()}`,stayName:selectedStay.name,country:selectedStay.country,city:selectedStay.city,checkIn:checkIn.value,checkOut:checkOut.value,guests:Number(byId('guests').value),total:selectedStay.price*nights(),name:byId('guest-name').value.trim(),email:byId('guest-email').value.trim(),phone:byId('guest-phone').value.trim(),notes:byId('guest-notes').value.trim()};
  try { localStorage.setItem(storageKey,JSON.stringify([request,...readRequests()])); } catch { searchMessage.textContent = 'Your browser could not save this request. Please check available storage and try again.'; bookingDialog.close(); return; }
  bookingDialog.close(); event.currentTarget.reset(); renderRequests();
  searchMessage.textContent = `Request ${request.code} saved in this browser. No room has been reserved.`;
  byId('saved-requests').scrollIntoView({behavior:'smooth'});
});
renderRequests();

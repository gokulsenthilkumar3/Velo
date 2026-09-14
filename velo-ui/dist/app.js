/** Browser-only Velo discovery and reservation prototype. */

// Data
const scooters = [
  { id: 'velo-one', name: 'Velo One', area: 'RS Puram', distance: 2, battery: 82, range: 34, price: 4, status: 'available', parking: 'Park inside the green Velo zone.', x: 23, y: 37 },
  { id: 'velo-air', name: 'Velo Air', area: 'Race Course', distance: 4, battery: 94, range: 39, price: 5, status: 'available', parking: 'Use any marked Velo bay near Race Course.', x: 62, y: 26 },
  { id: 'velo-go', name: 'Velo Go', area: 'Gandhipuram', distance: 5, battery: 67, range: 27, price: 4, status: 'available', parking: 'End only within the central service zone.', x: 49, y: 57 },
  { id: 'velo-mini', name: 'Velo Mini', area: 'Saibaba Colony', distance: 6, battery: 42, range: 17, price: 3, status: 'available', parking: 'Return to a Velo bay or marked green zone.', x: 17, y: 71 },
  { id: 'velo-city', name: 'Velo City', area: 'Peelamedu', distance: 8, battery: 76, range: 31, price: 4, status: 'available', parking: 'Parking is available near the railway underpass.', x: 77, y: 60 },
  { id: 'velo-plus', name: 'Velo Plus', area: 'Town Hall', distance: 7, battery: 28, range: 11, price: 3, status: 'service', parking: 'Temporarily unavailable while it is being checked.', x: 69, y: 79 },
];
let selectedScooterId = 'velo-one';
let reservation = null;
let toastTimerId;

// Helpers
/** Finds an element by ID. */
function getElement(id) { return document.getElementById(id); }
/** Gets the currently selected scooter. */
function getSelectedScooter() { return scooters.find((scooter) => scooter.id === selectedScooterId); }
/** Checks whether the session holds this scooter. */
function isHeld(scooter) { return reservation?.scooterId === scooter.id; }
/** Formats remaining hold time as MM:SS. */
function formatCountdown(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
/** Returns the rider-facing availability label. */
function statusLabel(scooter) {
  if (isHeld(scooter)) return 'Held for you';
  if (scooter.status === 'service') return 'Unavailable';
  return scooter.battery < 50 ? 'Low battery' : 'Available now';
}
/** Gets the active filters' matching scooters, in the requested order. */
function getVisibleScooters() {
  const query = getElement('search').value.trim().toLowerCase();
  const availability = getElement('availability').value;
  const minimumBattery = Number(getElement('battery').value);
  const sort = getElement('sort').value;
  const matches = scooters.filter((scooter) => {
    const searchable = `${scooter.name} ${scooter.area}`.toLowerCase();
    const matchesAvailability = availability === 'all'
      || (availability === 'available' && scooter.status === 'available' && !isHeld(scooter))
      || (availability === 'low' && scooter.battery < 60);
    return searchable.includes(query) && scooter.battery >= minimumBattery && matchesAvailability;
  });
  return matches.sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'battery' ? b.battery - a.battery : a.distance - b.distance));
}
/** Displays a temporary confirmation message. */
function showToast(message) {
  const toast = getElement('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(() => toast.classList.remove('show'), 4000);
}

// Render
/** Draws selectable markers for the visible scooter collection. */
function renderMap(scooterList) {
  const map = getElement('map');
  map.querySelectorAll('.marker').forEach((marker) => marker.remove());
  scooterList.forEach((scooter) => {
    const marker = document.createElement('button');
    const state = isHeld(scooter) ? 'held' : scooter.status === 'service' ? 'unavailable' : '';
    marker.className = `marker ${state} ${scooter.id === selectedScooterId ? 'selected' : ''}`;
    marker.style.left = `calc(${scooter.x}% - 22px)`;
    marker.style.top = `calc(${scooter.y}% - 22px)`;
    marker.setAttribute('aria-label', `${scooter.name}, ${scooter.battery}% charged. Select scooter.`);
    marker.innerHTML = '<span>v</span>';
    marker.addEventListener('click', () => selectScooter(scooter.id));
    map.append(marker);
  });
}
/** Draws keyboard-accessible cards for the visible scooters. */
function renderCards(scooterList) {
  const list = getElement('scooterList');
  list.innerHTML = '';
  scooterList.forEach((scooter) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `scooter-card ${scooter.id === selectedScooterId ? 'selected' : ''}`;
    card.setAttribute('aria-label', `Select ${scooter.name} in ${scooter.area}`);
    card.innerHTML = `<div class="card-top"><span class="scooter-icon" aria-hidden="true">🛴</span><span class="badge ${scooter.status === 'service' ? 'unavailable' : ''}">${statusLabel(scooter)}</span></div><h3>${scooter.name}</h3><p>${scooter.area} · ${scooter.distance} min walk</p><div class="card-meta"><span>${scooter.battery}% · ${scooter.range} km</span><strong>₹ ${scooter.price}/min</strong></div>`;
    card.addEventListener('click', () => selectScooter(scooter.id, true));
    card.addEventListener('keydown', (event) => handleCardKeys(event, scooter.id));
    list.append(card);
  });
  getElement('emptyResults').hidden = scooterList.length > 0;
}
/** Renders detail information and the reserve state for the selected scooter. */
function renderDetail() {
  const scooter = getSelectedScooter();
  const empty = getElement('detailEmpty');
  const detail = getElement('detailContent');
  if (!scooter) { empty.hidden = false; detail.hidden = true; return; }
  const held = isHeld(scooter);
  const unavailable = scooter.status === 'service';
  const seconds = held ? Math.max(0, Math.ceil((reservation.expiresAt - Date.now()) / 1000)) : 0;
  const buttonCopy = held ? `Held · ${formatCountdown(seconds)} remaining` : unavailable ? 'Currently unavailable' : 'Reserve this scooter';
  empty.hidden = true;
  detail.hidden = false;
  detail.innerHTML = `<div class="detail-title"><div><p class="eyebrow">${scooter.area} · ${scooter.distance} min walk</p><h2>${scooter.name}</h2><p>Estimated 8-minute ride: ₹ ${scooter.price * 8}</p></div><span class="badge ${unavailable ? 'unavailable' : ''}">${statusLabel(scooter)}</span></div><div class="battery-block"><div class="charge-line"><span>Battery & range</span><strong>${scooter.battery}% · ${scooter.range} km</strong></div><div class="charge-track"><i style="width:${scooter.battery}%"></i></div></div><div class="detail-grid"><div class="detail-stat"><span>Unlock fee</span><strong>₹ 10</strong></div><div class="detail-stat"><span>Ride price</span><strong>₹ ${scooter.price}/min</strong></div><div class="detail-stat"><span>Hold time</span><strong>${held ? formatCountdown(seconds) : '10 min'}</strong></div><div class="detail-stat"><span>Ride ready</span><strong>${scooter.battery > 50 ? 'Yes' : 'Short trips'}</strong></div></div><div class="parking-note">⌖ ${scooter.parking}</div><button class="reserve-button" id="reserveButton" aria-label="${buttonCopy}" ${held || unavailable ? 'disabled' : ''}>${buttonCopy}</button>`;
  const reserveButton = getElement('reserveButton');
  if (!reserveButton.disabled) reserveButton.addEventListener('click', openReservationDialog);
}
/** Updates the topbar's active-reservation callout. */
function renderReservationStatus() {
  const status = getElement('reservationStatus');
  if (!reservation) { status.hidden = true; return; }
  const seconds = Math.max(0, Math.ceil((reservation.expiresAt - Date.now()) / 1000));
  if (seconds <= 0) { cancelReservation(true); return; }
  status.hidden = false;
  status.innerHTML = `<strong>Velo scooter held</strong><br>${formatCountdown(seconds)} remaining · <button id="cancelHold" type="button" aria-label="Cancel current reservation">Cancel hold</button>`;
  getElement('cancelHold').addEventListener('click', () => cancelReservation(false));
}
/** Refreshes all linked discovery views. */
function render() {
  const visible = getVisibleScooters();
  if (!visible.some((scooter) => scooter.id === selectedScooterId) && visible.length) selectedScooterId = visible[0].id;
  getElement('resultCount').textContent = `${visible.length} scooter${visible.length === 1 ? '' : 's'} nearby`;
  renderMap(visible);
  renderCards(visible);
  renderDetail();
  renderReservationStatus();
}

// Event handlers
/** Selects a scooter and brings its details into mobile view after card selection. */
function selectScooter(id, scrollOnMobile = false) {
  selectedScooterId = id;
  render();
  if (scrollOnMobile && window.matchMedia('(max-width: 860px)').matches) getElement('detailContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
/** Selects a card with Enter or Space. */
function handleCardKeys(event, scooterId) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  selectScooter(scooterId, true);
}
/** Opens the reservation review dialog. */
function openReservationDialog() {
  if (reservation) { showToast('You already have a Velo on hold. Cancel it before reserving another.'); return; }
  const scooter = getSelectedScooter();
  getElement('reservationSummary').innerHTML = `<div class="summary-row"><span>Scooter</span><strong>${scooter.name}</strong></div><div class="summary-row"><span>Walk</span><strong>${scooter.distance} min · ${scooter.area}</strong></div><div class="summary-row"><span>Estimated 8-min ride</span><strong>₹ ${scooter.price * 8} + ₹ 10 unlock</strong></div><div class="summary-row"><span>Parking</span><strong>In service zone</strong></div>`;
  getElement('reserveDialog').showModal();
}
/** Creates the ten-minute local reservation. */
function confirmReservation(event) {
  event.preventDefault();
  const scooter = getSelectedScooter();
  reservation = { scooterId: scooter.id, expiresAt: Date.now() + 600000 };
  getElement('reserveDialog').close();
  render();
  showToast(`${scooter.name} is held for 10 minutes.`);
}
/** Releases the reservation after cancellation or expiry. */
function cancelReservation(expired) {
  if (!reservation) return;
  const scooter = scooters.find((item) => item.id === reservation.scooterId);
  reservation = null;
  render();
  showToast(expired ? `${scooter.name} is available again — your hold expired.` : `Reservation cancelled. ${scooter.name} is available again.`);
}
/** Restores every filter to its default state. */
function clearFilters() {
  getElement('search').value = '';
  getElement('availability').value = 'all';
  getElement('battery').value = '0';
  getElement('sort').value = 'distance';
  render();
}
/** Explicitly closes the dialog on Escape. */
function handleEscape(event) {
  if (event.key === 'Escape' && getElement('reserveDialog').open) { event.preventDefault(); getElement('reserveDialog').close(); }
}
/** Keeps both reservation countdown displays synchronized every second. */
function tickReservation() {
  if (!reservation) return;
  renderDetail();
  renderReservationStatus();
}

// Init
/** Connects controls to state and renders the first screen. */
function initializeApp() {
  ['search', 'availability', 'battery', 'sort'].forEach((id) => getElement(id).addEventListener(id === 'search' ? 'input' : 'change', render));
  getElement('clearFilters').addEventListener('click', clearFilters);
  getElement('locate').addEventListener('click', () => showToast('Your location is refreshed. Velo One is 2 minutes away.'));
  getElement('confirmReserve').addEventListener('click', confirmReservation);
  document.addEventListener('keydown', handleEscape);
  setInterval(tickReservation, 1000);
  render();
}
initializeApp();

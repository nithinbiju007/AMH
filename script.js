// Simple in-memory demo data + ID counters
const doctors = [
  { id: 1, name: "Dr. Rajesh Kumar", specialty: "Cardiology" },
  { id: 2, name: "Dr. Neha Verma", specialty: "Neurology" },
  { id: 3, name: "Dr. Aditya Nair", specialty: "Pediatrics" }
];

let patients = [
  { id: 1, name: "John Doe", age: 35, gender: "Male" }
];
let appointments = [];

let patientNextId = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1;
let appointmentNextId = appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1;

/* ---------- helpers ---------- */
function el(id) { return document.getElementById(id); }
function rowHTMLLabelLeftRight(left, right) {
  return `<div class="row"><div>${left}</div><div class="meta">${right}</div></div>`;
}

/* ---------- render doctors (always visible) ---------- */
function renderDoctors() {
  const container = el('doctorList'); // match your HTML ID
  container.innerHTML = '';
  doctors.forEach(d => {
    container.insertAdjacentHTML('beforeend',
      `<tr>
         <td>${d.id}</td>
         <td>${d.name}</td>
         <td>${d.specialty}</td>
       </tr>`);
  });
}
renderDoctors();

/* ---------- PATIENT: add ---------- */
el('formAddPatient').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = el('inputPatientName').value.trim();
  const age = parseInt(el('inputPatientAge').value, 10);
  const gender = el('inputPatientGender').value;

  if (!name || !age || !gender) { alert('Please fill all patient fields'); return; }

  const p = { id: patientNextId++, name, age, gender };
  patients.push(p);
  alert(`Patient added — ID ${p.id}`);
  this.reset();

  if (el('viewPatientsList').style.display === 'block') showPatients();
  if (el('removePatientsList').style.display === 'block') showRemovePatients();
});

/* ---------- PATIENT: view ---------- */
el('btnViewPatients').addEventListener('click', () => {
  toggleDisplay('viewPatientsList', showPatients);
});
function showPatients() {
  const list = el('viewPatientsList');
  if (patients.length === 0) {
    list.innerHTML = `<div class="row">No patients yet</div>
      <div style="text-align:center;margin-top:8px">
        <button class="btn outline" onclick="toggleDisplay('viewPatientsList')">Close</button>
      </div>`;
    return;
  }
  list.innerHTML = '';
  patients.forEach(p => {
    list.insertAdjacentHTML('beforeend',
      rowHTMLLabelLeftRight(`${p.name} (Age ${p.age})`, `ID:${p.id} • ${p.gender}`));
  });
  list.insertAdjacentHTML('beforeend',
    `<div style="text-align:center;margin-top:8px">
       <button class="btn outline" onclick="toggleDisplay('viewPatientsList')">Close</button>
     </div>`);
}

/* ---------- PATIENT: remove UI ---------- */
el('btnRemovePatients').addEventListener('click', () => {
  toggleDisplay('removePatientsList', showRemovePatients);
});
function showRemovePatients() {
  const list = el('removePatientsList');
  if (patients.length === 0) {
    list.innerHTML = `<div class="row">No patients to remove</div>
      <div style="text-align:center;margin-top:8px">
        <button class="btn outline" onclick="toggleDisplay('removePatientsList')">Close</button>
      </div>`;
    return;
  }
  list.innerHTML = '';
  patients.forEach(p => {
    list.insertAdjacentHTML('beforeend',
      `<div class="row">${p.name} <span class="meta">ID:${p.id}</span>
         <div style="margin-left:8px">
           <button class="btn outline" onclick="removePatient(${p.id})">Remove</button>
         </div>
       </div>`);
  });
  list.insertAdjacentHTML('beforeend',
    `<div style="text-align:center;margin-top:8px">
       <button class="btn outline" onclick="toggleDisplay('removePatientsList')">Close</button>
     </div>`);
}
function removePatient(id) {
  const i = patients.findIndex(p => p.id === id);
  if (i === -1) { alert('Patient not found'); return; }
  patients.splice(i, 1);
  alert(`Patient ID ${id} removed`);
  showRemovePatients();
  if (el('viewPatientsList').style.display === 'block') showPatients();
}

/* ---------- APPOINTMENTS: add ---------- */
el('formAddAppointment').addEventListener('submit', function (e) {
  e.preventDefault();
  const pid = parseInt(el('inputApPtId').value, 10);
  const did = parseInt(el('inputApDrId').value, 10);
  const date = el('inputApDate').value;

  if (!pid || !did || !date) { alert('Please fill appointment fields'); return; }
  if (!patients.find(p => p.id === pid)) { alert('Invalid Patient ID'); return; }
  if (!doctors.find(d => d.id === did)) { alert('Invalid Doctor ID'); return; }

  const a = { id: appointmentNextId++, pid, did, date };
  appointments.push(a);
  alert(`Appointment booked — ID ${a.id}`);
  this.reset();

  if (el('viewAppointmentsList').style.display === 'block') showAppointments();
  if (el('removeAppointmentsList').style.display === 'block') showRemoveAppointments();
});

/* ---------- APPOINTMENTS: view ---------- */
el('btnViewAppointments').addEventListener('click', () => toggleDisplay('viewAppointmentsList', showAppointments));
function showAppointments() {
  const list = el('viewAppointmentsList');
  if (appointments.length === 0) {
    list.innerHTML = `<div class="row">No appointments</div>
      <div style="text-align:center;margin-top:8px">
        <button class="btn outline" onclick="toggleDisplay('viewAppointmentsList')">Close</button>
      </div>`;
    return;
  }
  list.innerHTML = '';
  appointments.forEach(a => {
    const p = patients.find(x => x.id === a.pid);
    const d = doctors.find(x => x.id === a.did);
    list.insertAdjacentHTML('beforeend',
      rowHTMLLabelLeftRight(`${p ? p.name : 'Unknown'} → ${d ? d.name : 'Unknown'}`, `ID:${a.id} • ${a.date}`));
  });
  list.insertAdjacentHTML('beforeend',
    `<div style="text-align:center;margin-top:8px">
       <button class="btn outline" onclick="toggleDisplay('viewAppointmentsList')">Close</button>
     </div>`);
}

/* ---------- APPOINTMENTS: remove ---------- */
el('btnRemoveAppointments').addEventListener('click', () => toggleDisplay('removeAppointmentsList', showRemoveAppointments));
function showRemoveAppointments() {
  const list = el('removeAppointmentsList');
  if (appointments.length === 0) {
    list.innerHTML = `<div class="row">No appointments to remove</div>
      <div style="text-align:center;margin-top:8px">
        <button class="btn outline" onclick="toggleDisplay('removeAppointmentsList')">Close</button>
      </div>`;
    return;
  }
  list.innerHTML = '';
  appointments.forEach(a => {
    const p = patients.find(x => x.id === a.pid);
    const d = doctors.find(x => x.id === a.did);
    list.insertAdjacentHTML('beforeend',
      `<div class="row">${p ? p.name : 'Unknown'} → ${d ? d.name : 'Unknown'} <span class="meta">ID:${a.id}</span>
         <div style="margin-left:8px">
           <button class="btn outline" onclick="removeAppointment(${a.id})">Remove</button>
         </div>
       </div>`);
  });
  list.insertAdjacentHTML('beforeend',
    `<div style="text-align:center;margin-top:8px">
       <button class="btn outline" onclick="toggleDisplay('removeAppointmentsList')">Close</button>
     </div>`);
}
function removeAppointment(id) {
  const i = appointments.findIndex(a => a.id === id);
  if (i === -1) { alert('Appointment not found'); return; }
  appointments.splice(i, 1);
  alert(`Appointment ID ${id} removed`);
  showRemoveAppointments();
  if (el('viewAppointmentsList').style.display === 'block') showAppointments();
}

/* ---------- utility toggle ---------- */
function toggleDisplay(id, onShow) {
  const eln = document.getElementById(id);
  if (eln.style.display === 'block') {
    eln.style.display = 'none';
  } else {
    eln.style.display = 'block';
    if (typeof onShow === 'function') onShow();
  }
}

/* ---------- header + hero buttons linking ---------- */
el('btnViewDoctorsHero').addEventListener('click', () => document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' }));
el('btnAddPatientTop').addEventListener('click', () => document.getElementById('patientSection').scrollIntoView({ behavior: 'smooth' }));

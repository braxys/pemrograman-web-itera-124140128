

import { DashboardApp } from "./modules/DashboardApp.js";
import { fetchCampusWeather } from "./modules/weatherApi.js";
import { fetchDailyQuote } from "./modules/quoteApi.js";

const dashboard = new DashboardApp();

const taskForm = document.querySelector("#taskForm");
const taskTitleInput = document.querySelector("#taskTitle");
const taskCategoryInput = document.querySelector("#taskCategory");
const taskPriorityInput = document.querySelector("#taskPriority");
const taskDueDateInput = document.querySelector("#taskDueDate");
const taskNotesInput = document.querySelector("#taskNotes");

const taskListContainer = document.querySelector("#taskList");
const taskCountBadge = document.querySelector("#taskCountBadge");

const searchInput = document.querySelector("#searchInput");
const statusFilterSelect = document.querySelector("#statusFilter");
const categoryFilterSelect = document.querySelector("#categoryFilter");
const priorityFilterSelect = document.querySelector("#priorityFilter");
const sortBySelect = document.querySelector("#sortBy");

const seedDataBtn = document.querySelector("#seedDataBtn");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

const statTotalEl = document.querySelector("#statTotal");
const statActiveEl = document.querySelector("#statActive");
const statCompletedEl = document.querySelector("#statCompleted");
const statHighPriorityEl = document.querySelector("#statHighPriority");

const liveClockEl = document.querySelector("#liveClock");
const liveDateEl = document.querySelector("#liveDate");
const weatherWidgetEl = document.querySelector("#weatherWidget");
const quoteContainerEl = document.querySelector("#quoteContainer");
const refreshQuoteBtn = document.querySelector("#refreshQuoteBtn");

const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editForm");
const editTaskIdInput = document.querySelector("#editTaskId");
const editTitleInput = document.querySelector("#editTitle");
const editCategoryInput = document.querySelector("#editCategory");
const editPriorityInput = document.querySelector("#editPriority");
const editDueDateInput = document.querySelector("#editDueDate");
const editNotesInput = document.querySelector("#editNotes");
const cancelEditBtn = document.querySelector("#cancelEditBtn");

const toastEl = document.querySelector("#toast");

let toastTimer = null;
const showToast = (message, type = "info") => {
  if (!toastEl) return;
  clearTimeout(toastTimer);

  toastEl.textContent = message;
  toastEl.className = `toast toast-${type} toast-visible`;

  toastTimer = setTimeout(() => {
    toastEl.className = "toast";
  }, 2800);
};

const formatIndonesianDate = (dateObj = new Date()) => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayName = days[dateObj.getDay()];
  const dateNum = dateObj.getDate();
  const monthName = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${dayName}, ${dateNum} ${monthName} ${year}`;
};

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  if (liveClockEl) {
    liveClockEl.textContent = `${hours}:${minutes}:${seconds} WIB`;
  }
  if (liveDateEl) {
    liveDateEl.textContent = formatIndonesianDate(now);
  }
};

const loadWeatherWidget = async () => {
  if (!weatherWidgetEl) return;
  weatherWidgetEl.innerHTML = `<span class="widget-loading">Memuat cuaca kampus...</span>`;

  try {
    const weather = await fetchCampusWeather();
    const { temperature, condition, icon, location } = weather;

    weatherWidgetEl.innerHTML = `
      <div class="weather-box" title="Data realtime Open-Meteo untuk ${location}">
        <span class="weather-icon">${icon}</span>
        <div class="weather-meta">
          <span class="weather-temp">${temperature}°C</span>
          <span class="weather-condition">${condition}</span>
          <span class="weather-loc">${location}</span>
        </div>
      </div>
    `;
  } catch (err) {
    weatherWidgetEl.innerHTML = `<span class="widget-error">Cuaca offline</span>`;
  }
};

const loadQuoteWidget = async () => {
  if (!quoteContainerEl) return;
  quoteContainerEl.innerHTML = `<p class="quote-text italic">"Memuat kutipan hari ini..."</p>`;

  try {
    const { quote, author } = await fetchDailyQuote();
    quoteContainerEl.innerHTML = `
      <blockquote class="quote-content">
        <p class="quote-text">“${quote}”</p>
        <cite class="quote-author">— ${author}</cite>
      </blockquote>
    `;
  } catch (err) {
    quoteContainerEl.innerHTML = `<p class="quote-text">Tetap semangat belajar dan selesaikan tugasmu!</p>`;
  }
};

const updateStatsUI = () => {
  const { total, active, completed, highPriority } = dashboard.getStatistics();

  if (statTotalEl) statTotalEl.textContent = total;
  if (statActiveEl) statActiveEl.textContent = active;
  if (statCompletedEl) statCompletedEl.textContent = completed;
  if (statHighPriorityEl) statHighPriorityEl.textContent = highPriority;
  if (taskCountBadge) taskCountBadge.textContent = `${total} tugas`;
};

const updateCategoryFilterOptions = () => {
  if (!categoryFilterSelect) return;
  const currentVal = categoryFilterSelect.value;
  const categories = dashboard.getCategories();

  const optionsHTML = categories
    .map(cat => {
      const label = cat === "all" ? "Semua Kategori" : cat;
      const isSelected = cat === currentVal ? "selected" : "";
      return `<option value="${cat}" ${isSelected}>${label}</option>`;
    })
    .join("");

  categoryFilterSelect.innerHTML = optionsHTML;
};

const renderTaskList = () => {
  const filteredTasks = dashboard.getFilteredTasks();

  if (filteredTasks.length === 0) {
    taskListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p class="empty-title">Tidak ada tugas ditemukan</p>
        <p class="empty-desc">
          ${dashboard.tasks.length === 0
            ? "Tambahkan tugas kuliah baru atau klik 'Muat Contoh Tugas Informatika'."
            : "Tidak ada tugas yang sesuai dengan filter atau pencarian Anda."}
        </p>
      </div>
    `;
    return;
  }

  // Template literal membentuk kartu tugas dari state yang sudah difilter.
  const itemsHTML = filteredTasks
    .map(task => {
      const { id, title, category, priority, dueDate, notes, done } = task;
      const deadlineInfo = task.getDeadlineStatus();

      const priorityBadgeClass = `badge-priority-${priority}`;
      const statusBadgeClass = `badge-deadline-${deadlineInfo.status}`;
      const itemCompletedClass = done ? "task-item-done" : "";

      const formattedDueDate = dueDate
        ? new Date(dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "Tidak ditentukan";

      return `
        <article class="task-card ${itemCompletedClass}" data-id="${id}">
          <div class="task-card-main">
            <label class="custom-checkbox-wrapper">
              <input type="checkbox" class="task-toggle-checkbox" ${done ? "checked" : ""} data-action="toggle" />
              <span class="custom-checkbox-mark"></span>
            </label>

            <div class="task-info">
              <div class="task-header-row">
                <span class="task-category-badge">${category}</span>
                <span class="task-priority-badge ${priorityBadgeClass}">Prioritas ${priority}</span>
                <span class="task-deadline-badge ${statusBadgeClass}">${deadlineInfo.label}</span>
              </div>

              <h3 class="task-title">${title}</h3>

              ${notes ? `<p class="task-notes">${notes}</p>` : ""}

              <div class="task-meta-footer">
                <span class="task-due-date">📅 Tenggat: <strong>${formattedDueDate}</strong></span>
              </div>
            </div>
          </div>

          <div class="task-actions">
            <button class="btn-action btn-edit" data-action="edit" title="Edit Tugas">
              ✏️ Edit
            </button>
            <button class="btn-action btn-delete" data-action="delete" title="Hapus Tugas">
              🗑️ Hapus
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  taskListContainer.innerHTML = itemsHTML;
};

const refreshDashboard = () => {
  renderTaskList();
  updateStatsUI();
  updateCategoryFilterOptions();
};

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitleInput.value;
  const category = taskCategoryInput.value;
  const priority = taskPriorityInput.value;
  const dueDate = taskDueDateInput.value;
  const notes = taskNotesInput.value;

  try {
    dashboard.addTask({ title, category, priority, dueDate, notes });
    taskForm.reset();
    refreshDashboard();
    showToast("Tugas berhasil ditambahkan!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
});

taskListContainer.addEventListener("click", (e) => {
  const target = e.target;
  const actionEl = target.closest("[data-action]");
  if (!actionEl) return;

  const card = target.closest(".task-card");
  if (!card) return;
  const taskId = card.dataset.id;
  const action = actionEl.dataset.action;

  if (action === "toggle") {
    dashboard.toggleTask(taskId);
    refreshDashboard();
    const task = dashboard.getTaskById(taskId);
    showToast(task.done ? "Tugas ditandai selesai." : "Tugas diaktifkan kembali.", "info");
  } else if (action === "delete") {
    const task = dashboard.getTaskById(taskId);
    const confirmDelete = window.confirm(`Hapus tugas "${task ? task.title : ""}"?`);
    if (confirmDelete) {
      dashboard.deleteTask(taskId);
      refreshDashboard();
      showToast("Tugas berhasil dihapus.", "warning");
    }
  } else if (action === "edit") {
    openEditModal(taskId);
  }
});

const openEditModal = (taskId) => {
  const task = dashboard.getTaskById(taskId);
  if (!task) return;

  editTaskIdInput.value = task.id;
  editTitleInput.value = task.title;
  editCategoryInput.value = task.category;
  editPriorityInput.value = task.priority;
  editDueDateInput.value = task.dueDate || "";
  editNotesInput.value = task.notes || "";

  editModal.classList.add("modal-open");
};

const closeEditModal = () => {
  editModal.classList.remove("modal-open");
  editForm.reset();
};

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = editTaskIdInput.value;
  const title = editTitleInput.value.trim();

  if (!title) {
    showToast("Judul tugas tidak boleh kosong.", "error");
    return;
  }

  const changes = {
    title,
    category: editCategoryInput.value.trim() || "Umum",
    priority: editPriorityInput.value,
    dueDate: editDueDateInput.value,
    notes: editNotesInput.value.trim()
  };

  dashboard.updateTask(id, changes);
  closeEditModal();
  refreshDashboard();
  showToast("Perubahan tugas berhasil disimpan.", "success");
});

cancelEditBtn.addEventListener("click", closeEditModal);

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

searchInput.addEventListener("input", (e) => {
  dashboard.searchQuery = e.target.value;
  renderTaskList();
});

statusFilterSelect.addEventListener("change", (e) => {
  dashboard.statusFilter = e.target.value;
  renderTaskList();
});

categoryFilterSelect.addEventListener("change", (e) => {
  dashboard.categoryFilter = e.target.value;
  renderTaskList();
});

priorityFilterSelect.addEventListener("change", (e) => {
  dashboard.priorityFilter = e.target.value;
  renderTaskList();
});

sortBySelect.addEventListener("change", (e) => {
  dashboard.sortBy = e.target.value;
  renderTaskList();
});

seedDataBtn.addEventListener("click", () => {
  const originalText = seedDataBtn.innerHTML;
  seedDataBtn.disabled = true;
  seedDataBtn.textContent = "Memuat contoh tugas...";

  try {
    const count = dashboard.seedSampleTasks();
    refreshDashboard();
    showToast(`${count} contoh tugas informatika berhasil dimuat!`, "success");
  } catch (error) {
    showToast("Gagal memuat contoh tugas: " + error.message, "error");
  } finally {
    seedDataBtn.disabled = false;
    seedDataBtn.innerHTML = originalText;
  }
});

clearCompletedBtn.addEventListener("click", () => {
  const { completed } = dashboard.getStatistics();
  if (completed === 0) {
    showToast("Tidak ada tugas selesai yang perlu dihapus.", "info");
    return;
  }

  const confirmClear = window.confirm(`Hapus ${completed} tugas yang sudah selesai?`);
  if (confirmClear) {
    const deletedCount = dashboard.clearCompleted();
    refreshDashboard();
    showToast(`${deletedCount} tugas selesai berhasil dibersihkan.`, "warning");
  }
});

refreshQuoteBtn.addEventListener("click", () => {
  loadQuoteWidget();
  showToast("Kutipan diperbarui.", "info");
});

const init = () => {
  updateClock();
  setInterval(updateClock, 1000);

  // Isi dashboard baru dengan contoh tugas saat belum ada data tersimpan.
  if (dashboard.tasks.length === 0) {
    dashboard.seedSampleTasks();
  }

  loadWeatherWidget();
  loadQuoteWidget();

  refreshDashboard();
};

document.addEventListener("DOMContentLoaded", init);
